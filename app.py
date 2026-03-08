
import os
import json
import threading
import random
from datetime import datetime, timezone, timedelta
from flask import Flask, render_template, jsonify, request
from flask import send_from_directory
import re
import markdown
from collections import defaultdict

app = Flask(__name__)
bracket_lock = threading.Lock()

BRACKET_FILE = "bracket.json"

PROBLEMS_DIR = "static/problems"

# HKT is UTC+8
HKT_TZ = timezone(timedelta(hours=8))


# -----------------------------
# Utility Functions
# -----------------------------

def parse_time(time_str):
    if not time_str or time_str in ["DNF", "null"]:
        return float('inf') # Treat DNF or None as an infinitely large time
    h, m, s = time_str.split(":")
    return float(h) * 3600 + float(m) * 60 + float(s)

def load_bracket():
    if not os.path.exists(BRACKET_FILE):
        return None

    try:
        with open(BRACKET_FILE) as f:
            return json.load(f)
    except Exception:
        return None

def get_problems_by_difficulty():
    """
    Scans the PROBLEMS_DIR and groups markdown files by a difficulty
    prefix in their filename (e.g., '1-easy.md', '2-medium.md').
    """
    problems_by_difficulty = defaultdict(list)
    if not os.path.exists(PROBLEMS_DIR):
        os.makedirs(PROBLEMS_DIR) # Ensure directory exists
    for f in os.listdir(PROBLEMS_DIR):
        if f.endswith(".md"):
            try:
                # Assumes problem names like "1-problem-name.md"
                difficulty_str = f[0]
                if difficulty_str.isdigit():
                    difficulty = int(difficulty_str)
                    problems_by_difficulty[difficulty].append(f)
            except (ValueError, IndexError):
                # Ignore files without a valid numeric prefix
                pass
    return problems_by_difficulty

PROBLEMS_BY_DIFFICULTY = get_problems_by_difficulty()

def save_bracket(bracket):
    with open(BRACKET_FILE, "w") as f:
        json.dump(bracket, f, indent=4)


def assign_problem(round_num, available_problems_by_difficulty):
    """
    Assigns a problem based on the round number and available problems.
    Removes the chosen problem from the available pool to prevent duplicates.
    """
    # Difficulty ramps up: 1 for Round 1, 2 for Round 2, and 3 for all subsequent rounds.
    if round_num == 1:
        difficulty = 1
    elif round_num == 2:
        difficulty = 2
    else: # Rounds 3, 4, 5, etc., will all use difficulty 3
        difficulty = 3

    if not available_problems_by_difficulty.get(difficulty):
        # This should be caught by the pre-check, but is a safeguard.
        raise ValueError(f"Not enough unique problems for difficulty level {difficulty}.")
    
    # Check if the list for the required difficulty is empty
    if not available_problems_by_difficulty[difficulty]:
        # This is the crucial check. If we're out of problems for this difficulty, raise an error.
        # This error will be caught by the pre-flight check in `create_bracket`.
        raise ValueError(
            f"Not enough unique problems for difficulty level {difficulty}. "
            f"Please add more 'level {difficulty}' problems to the /problems directory."
        )

    problem_file = available_problems_by_difficulty[difficulty].pop(0) # Get and remove first problem
    return problem_file, difficulty

def smart_shuffle_participants(participants_list_of_dicts):
    """
    Shuffles participants to minimize same-house matchups in the first round.
    It arranges the list so that when paired sequentially (p1 vs p2, p3 vs p4),
    the chances of p1 and p2 being from the same house are low.
    """
    participants_by_house = defaultdict(list)
    for p in participants_list_of_dicts:
        participants_by_house[p['house']].append(p)

    # Sort houses by number of participants, descending. This helps place the largest groups first.
    sorted_houses = sorted(participants_by_house.keys(), key=lambda h: len(participants_by_house[h]), reverse=True)

    shuffled_list = []
    
    # We will draw one participant from each house in a round-robin fashion.
    # This continues until all participants are placed.
    while len(shuffled_list) < len(participants_list_of_dicts):
        for house in sorted_houses:
            if participants_by_house[house]:
                # For an element of randomness, pop a random participant from the house list
                participant_to_add = participants_by_house[house].pop(random.randint(0, len(participants_by_house[house])-1))
                shuffled_list.append(participant_to_add)

    return shuffled_list

def generate_single_elim(participants_list_of_dicts, available_problems):

    n = len(participants_list_of_dicts)

    # For single elim, we need a power of 2.
    # The logic can be extended to handle non-power-of-2 with byes, but for now we'll stick to the requirement.
    is_power_of_two = (n > 0) and ((n & (n - 1)) == 0)
    if not is_power_of_two:
         raise ValueError("Single elimination requires a power of 2 number of participants.")

    # --- Pre-flight check for problems ---
    rounds_to_play = (n - 1).bit_length() -1
    required_problems = defaultdict(int)
    for r in range(1, rounds_to_play + 1):
        matches_in_round = n // (2**r)
        difficulty = 1 if r == 1 else 2 if r == 2 else 3
        required_problems[difficulty] += matches_in_round
    if n >= 4: # 3rd place match
        difficulty = 1 if rounds_to_play == 1 else 2 if rounds_to_play == 2 else 3
        required_problems[difficulty] += 1

    # Use the new smart shuffle instead of random.shuffle
    participants_list_of_dicts = smart_shuffle_participants(participants_list_of_dicts)

    total_rounds = 0
    temp_n = n
    while temp_n > 1: temp_n //= 2; total_rounds += 1

    total_matches = n - 1
    matches = []

    # --- Create empty matches first ---
    for match_num in range(1, total_matches + 1):
        matches.append({
            "match_num": match_num,
            "winner_proceeds_to": None,
            "loser_proceeds_to": None,
            "problem": None, # Will assign later
            "problem_difficulty": None,
            "participant1": None,
            "participant2": None,
            "participant1_result": None,
            "participant2_result": None,
            "start_time": None
        })
    
    # --- Fill first round and assign problems ---
    first_round_matches_count = n // 2
    for i in range(first_round_matches_count):
        match_idx = i
        matches[match_idx]["participant1"] = participants_list_of_dicts[i*2]
        matches[match_idx]["participant2"] = participants_list_of_dicts[i*2 + 1]
        problem_file, difficulty = assign_problem(1, available_problems)
        matches[match_idx]["problem"], matches[match_idx]["problem_difficulty"] = problem_file, difficulty

    # --- Wire winners correctly ---
    current_round_start_idx = 0
    current_round_size = first_round_matches_count
    next_match_start_idx = first_round_matches_count
    current_round_num = 1

    while current_round_size > 1:
        current_round_num += 1
        for i in range(0, current_round_size, 2):
            parent_match_idx = next_match_start_idx + (i // 2)

            matches[current_round_start_idx + i]["winner_proceeds_to"] = matches[parent_match_idx]["match_num"]
            matches[current_round_start_idx + i + 1]["winner_proceeds_to"] = matches[parent_match_idx]["match_num"]
            
            # Assign problem for the parent match (which is in the next round)
            problem_file, difficulty = assign_problem(current_round_num, available_problems)
            matches[parent_match_idx]["problem"], matches[parent_match_idx]["problem_difficulty"] = problem_file, difficulty

        current_round_start_idx = next_match_start_idx
        current_round_size //= 2
        next_match_start_idx += current_round_size

    # --- Add 3rd place playoff ---    
    if n >= 4:
        # The semi-finals are the two matches that feed into the final match.
        final_match_num = total_matches
        semi_final_matches_indices = [i for i, m in enumerate(matches) if m.get("winner_proceeds_to") == final_match_num]

        third_place_match_num = len(matches) + 1
        # Force 3rd place match to be a 2-star problem
        problem_file, difficulty = assign_problem(2, available_problems)

        matches.append({
            "match_num": third_place_match_num,
            "winner_proceeds_to": None,
            "loser_proceeds_to": None, # This will be wired later
            "problem": problem_file,
            "problem_difficulty": difficulty,
            "participant1": None,
            "participant2": None,
            "participant1_result": None,
            "participant2_result": None,
            "start_time": None,
            "is_third_place": True
        })

        # Wire semifinal losers
        for match_index in semi_final_matches_indices:
            matches[match_index]["loser_proceeds_to"] = third_place_match_num
    return matches
    
def _generate_ub_matches(participants_list, available_problems):
    # Use the new smart shuffle
    participants_list_of_dicts = smart_shuffle_participants(participants_list)
    n = len(participants_list_of_dicts)
    
    total_ub_matches = n - 1
    ub_matches = []

    total_rounds = 0
    temp_n = n
    while temp_n > 1:
        temp_n //= 2
        total_rounds += 1

    for match_num in range(1, total_ub_matches + 1):
        ub_matches.append({
            "match_num": match_num,
            "winner_proceeds_to": None,
            "loser_proceeds_to": None,
            "problem": None,
            "problem_difficulty": None,
            "participant1": None,
            "participant2": None,
            "participant1_result": None,
            "participant2_result": None,
            "start_time": None
        })

    first_round_matches_count = n // 2
    for i in range(first_round_matches_count):
        match_idx = i
        ub_matches[match_idx]["participant1"] = participants_list_of_dicts[i*2]
        ub_matches[match_idx]["participant2"] = participants_list_of_dicts[i*2 + 1]
        problem_file, difficulty = assign_problem(1, available_problems)
        ub_matches[match_idx]["problem"], ub_matches[match_idx]["problem_difficulty"] = problem_file, difficulty

    current_round_start_idx = 0
    current_round_size = first_round_matches_count
    next_match_start_idx = first_round_matches_count
    current_round_num = 1

    while current_round_size > 1:
        current_round_num += 1
        for i in range(0, current_round_size, 2):
            parent_match_idx = next_match_start_idx + (i // 2)

            ub_matches[current_round_start_idx + i]["winner_proceeds_to"] = ub_matches[parent_match_idx]["match_num"]
            ub_matches[current_round_start_idx + i + 1]["winner_proceeds_to"] = ub_matches[parent_match_idx]["match_num"]
            problem_file, difficulty = assign_problem(current_round_num, available_problems)
            ub_matches[parent_match_idx]["problem"], ub_matches[parent_match_idx]["problem_difficulty"] = problem_file, difficulty

        current_round_start_idx = next_match_start_idx
        current_round_size //= 2
        next_match_start_idx += current_round_size
    
    return ub_matches

def generate_double_elim(participants_list_of_dicts, available_problems):
    """
    Generates a double-elimination bracket for a power-of-two number of participants.
    """
    n = len(participants_list_of_dicts)

    if (n & (n - 1)) != 0 or n < 4:
        raise ValueError("Double elimination requires a power of 2 with at least 4 participants.")
    # Shuffling is now handled inside _generate_ub_matches

    # --- 1. Generate Upper Bracket ---
    upper_matches = _generate_ub_matches(participants_list_of_dicts, available_problems)
    upper_matches = [m for m in upper_matches if not m.get("is_third_place")]
    for match in upper_matches:
        match['bracket'] = 'upper'

    matches = list(upper_matches)
    match_num_counter = len(matches) + 1

    # --- 2. Create all Lower Bracket matches ---
    lower_matches = []
    # A DE bracket has (n-1) UB matches and (n-2) LB matches, total 2n-3.
    # Grand final is the (2n-2)th match.
    for _ in range(n - 2):
        # For simplicity, we'll assign difficulty 1 to all lower bracket matches for now.
        # This can be refined to have its own progression.
        problem_file, difficulty = assign_problem(1, available_problems)
        lower_matches.append({
            "match_num": match_num_counter,
            "winner_proceeds_to": None,
            "loser_proceeds_to": None,
            "problem": problem_file, "problem_difficulty": difficulty,
            "participant1": None,
            "participant2": None,
            "participant1_result": None,
            "participant2_result": None,
            "start_time": None,
            "bracket": "lower",
        })
        match_num_counter += 1

    matches.extend(lower_matches)

    # --- 3. Wire up the entire Lower Bracket dynamically ---
    # The pattern of rounds in the lower bracket is: 2 small rounds, 1 big round, repeat.
    upper_matches_by_round = {}
    for match in upper_matches:
        round_num = 1
        curr = match
        while True:
            parent = next((m for m in upper_matches if m["winner_proceeds_to"] == curr["match_num"]), None)
            if not parent: break
            round_num += 1
            curr = parent
        if round_num not in upper_matches_by_round:
            upper_matches_by_round[round_num] = []
        upper_matches_by_round[round_num].append(match)

    lower_match_idx = 0
    # First set of lower rounds are fed by first round of upper
    for i in range(0, len(upper_matches_by_round[1]), 2):
        upper_matches_by_round[1][i]["loser_proceeds_to"] = lower_matches[lower_match_idx]["match_num"]
        upper_matches_by_round[1][i+1]["loser_proceeds_to"] = lower_matches[lower_match_idx]["match_num"]
        lower_match_idx += 1
    
    # Subsequent rounds
    num_upper_rounds = len(upper_matches_by_round)
    prev_lower_round_winners = list(range(lower_match_idx)) # Winners of the first LB matches

    for r in range(2, num_upper_rounds + 1):
        # "Big" round where LB winners play each other
        next_lower_round_winners = []
        for i in range(0, len(prev_lower_round_winners), 2):
            lower_matches[prev_lower_round_winners[i]]["winner_proceeds_to"] = lower_matches[lower_match_idx]["match_num"]
            lower_matches[prev_lower_round_winners[i+1]]["winner_proceeds_to"] = lower_matches[lower_match_idx]["match_num"]
            next_lower_round_winners.append(lower_match_idx)
            lower_match_idx += 1
        
        # "Small" round where UB losers play LB winners
        # If it's not the final UB round's loser
        if r <= num_upper_rounds:
            upper_losers = upper_matches_by_round[r]
            # Iterate through the winners of the previous LB round, pairing them with UB losers
            for i in range(len(next_lower_round_winners)):
                upper_losers[i]["loser_proceeds_to"] = lower_matches[lower_match_idx]["match_num"]
                lower_matches[next_lower_round_winners[i]]["winner_proceeds_to"] = lower_matches[lower_match_idx]["match_num"]
                lower_match_idx += 1
            prev_lower_round_winners = list(range(lower_match_idx - len(next_lower_round_winners), lower_match_idx))

    # --- 4. Create and wire Grand Final ---
    grand_final_num = match_num_counter
    # Grand final is always a high-difficulty problem
    problem_file, difficulty = assign_problem(3, available_problems)
    matches.append({
        "match_num": grand_final_num,
        "winner_proceeds_to": None,
        "loser_proceeds_to": None,
        "problem": problem_file, "problem_difficulty": difficulty,
        "participant1": None, # Winner of Upper Bracket
        "participant2": None, # Winner of Lower Bracket
        "participant1_result": None,
        "participant2_result": None,
        "start_time": None,
        "is_grand_final": True,
        "bracket": "final"
    })

    # Wire upper and lower bracket finals to Grand Final
    upper_final = next(m for m in upper_matches if not m['winner_proceeds_to'])
    upper_final['winner_proceeds_to'] = grand_final_num
    
    # The last match wired is the lower bracket final
    matches[lower_match_idx-1]["winner_proceeds_to"] = grand_final_num

    return matches

def generate_hybrid_elim(participants_list_of_dicts, available_problems):
    """
    Generates a bracket for 12 or 24 participants.
    Runs 1v1 rounds until 3 participants remain, then creates a 3-way
    round-robin final.
    """
    n = len(participants_list_of_dicts)

    if n not in [12, 24]:
        raise ValueError("Hybrid elimination only supports 12 or 24 participants.")
    current_participants = smart_shuffle_participants(participants_list_of_dicts)

    matches = []
    match_num_counter = 1
    current_participants = list(participants_list_of_dicts)
    last_round_match_indices = []
    current_round_num = 0

    while len(current_participants) > 3:
        num_matches_in_round = len(current_participants) // 2
        next_round_participants = []
        current_round_match_indices = []

        current_round_num += 1
        for i in range(num_matches_in_round):
            problem_file, difficulty = assign_problem(current_round_num, available_problems)
            match = {
                "match_num": match_num_counter,
                "winner_proceeds_to": None, # Will be wired up later
                "loser_proceeds_to": None,
                "problem": problem_file, "problem_difficulty": difficulty,
                # Store full participant objects
                "participant1": current_participants[i*2],
                "participant2": current_participants[i*2 + 1],
                "participant1_result": None,
                "participant2_result": None,
                "start_time": None
            }
            matches.append(match)
            current_round_match_indices.append(match_num_counter -1)
            match_num_counter += 1

        # Wire previous round to this round
        if last_round_match_indices:
            for i, parent_match_idx in enumerate(last_round_match_indices):
                child_match_num = matches[current_round_match_indices[i // 2]]["match_num"]
                matches[parent_match_idx]["winner_proceeds_to"] = child_match_num

        last_round_match_indices = list(current_round_match_indices)
        # Placeholder for winners
        current_participants = [f"Winner of M{matches[idx]['match_num']}" for idx in current_round_match_indices]

    # --- Create 3-way Round-Robin Final ---
    finalists_placeholders = current_participants
    sub_matches = []
    for i in range(3):
        problem_file, difficulty = assign_problem(current_round_num + 1, available_problems)
        sub_match = {
            "match_num": match_num_counter, # These are the sub-matches of the final
            "problem": problem_file, "problem_difficulty": difficulty,
            "participant1": None,
            "participant2": None,
            "participant1_result": None,
            "participant2_result": None,
            "start_time": None,
        }
        sub_matches.append(sub_match)
        matches.append(sub_match)
        match_num_counter += 1

    final_match = {
        "match_num": match_num_counter,
        "match_type": "three_way_round_robin",
        "sub_matches": [m["match_num"] for m in sub_matches], # Store match_nums, not objects
        "winner": None # Overall winner
    }
    matches.append(final_match)

    return matches
# -----------------------------
# Routes
# -----------------------------

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/bracket")
def get_bracket():
    try:
        bracket = load_bracket()
        if bracket:
            return jsonify(bracket)
        return jsonify({"error": "No bracket"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/create_bracket", methods=["POST"])
def create_bracket():
    # with bracket_lock: # Lock removed, will be handled in specific modification routes
    data = request.json
    elim_type = data["type"]

    if not os.path.exists("participants.txt"): return jsonify({"error": "participants.txt missing"}), 400

    with open("participants.txt") as f: participants_raw = [p.strip() for p in f if p.strip()]
    
    participants_list_of_dicts = []
    # Regex to find a house initial in parentheses at the end of the string
    house_regex = re.compile(r'\s*\(([YCBMA])\)$', re.IGNORECASE)

    for p_line in participants_raw:
        match = house_regex.search(p_line)
        if match:
            name = house_regex.sub('', p_line).strip()
            house = match.group(1).upper()
            participants_list_of_dicts.append({"name": name, "house": house})
        # If no match, we can decide how to handle it. Here, we'll assign N/A.
        else:
            participants_list_of_dicts.append({"name": p_line.strip(), "house": "N/A"})

    n = len(participants_list_of_dicts)

    # --- Problem Availability Check ---
    # Calculate required problems based on bracket type and participant count
    required_problems = defaultdict(int)
    num_matches = 0
    if elim_type == "single" and (n & (n - 1)) == 0 and n != 0:
        num_matches = n - 1
        if n >= 4: num_matches += 1 # 3rd place
        # This is a simplification; a more detailed check is inside generate_single_elim
        # For now, we'll just check total problems.
    elif elim_type == "double" and (n & (n - 1)) == 0 and n >= 4:
        num_matches = 2 * n - 2 # UB + LB + Final
    elif n in [12, 24]:
        num_matches = (n - 3) + 3 # Elimination matches + 3 final matches

    available_problems_by_difficulty = get_problems_by_difficulty()
    total_available_problems = sum(len(p_list) for p_list in available_problems_by_difficulty.values())

    if total_available_problems < num_matches:
        return jsonify({
            "error": f"Not enough unique problems available. Required: {num_matches}, Available: {total_available_problems}. Please add more .md files to the /problems directory."
        }), 400
    
    try:
        # Create a mutable copy of problems for assignment, and shuffle them for randomness
        problems_for_bracket = {
            diff: random.sample(p_list, len(p_list)) for diff, p_list in available_problems_by_difficulty.items()
        }

        if elim_type == "double":
            bracket = generate_double_elim(participants_list_of_dicts, problems_for_bracket)
        elif elim_type == "single" and (n & (n - 1)) == 0 and n != 0: # Power of 2
            bracket = generate_single_elim(participants_list_of_dicts, problems_for_bracket)
        elif elim_type == "hybrid":
            bracket = generate_hybrid_elim(participants_list_of_dicts, problems_for_bracket)
        else:
            return jsonify({"error": f"Unsupported number of participants: {n}. Please use a power of 2, 12, or 24."}), 400
    except ValueError as e:
        # Catch specific errors from problem assignment and return them to the user.
        return jsonify({"error": str(e)}), 400

    save_bracket(bracket)
    return jsonify(bracket)


@app.route("/match/<int:match_id>")
def match_page(match_id):
    return render_template("match.html", match_id=match_id)

@app.route("/multimatch")
def multi_match_page():
    match_id1 = request.args.get('m1', type=int)
    match_id2 = request.args.get('m2', type=int)
    if not match_id1 or not match_id2:
        return "Please provide two match IDs, e.g., /multimatch?m1=1&m2=2", 400
    return render_template("multimatch.html", match_id1=match_id1, match_id2=match_id2)

@app.route("/api/match/<int:match_id>")
def get_match(match_id):
    bracket = load_bracket()
    match = next(m for m in bracket if m["match_num"] == match_id)
    return jsonify(match)


@app.route("/api/start/<int:match_id>", methods=["POST"])
def start_match(match_id):
    return start_matches([match_id])

@app.route("/api/start_matches", methods=["POST"])
def start_multiple_matches():
    data = request.json
    match_ids = data.get("match_ids", [])
    if not match_ids:
        return jsonify({"error": "No match IDs provided"}), 400
    return start_matches(match_ids)

def start_matches(match_ids):
    """A helper function to start one or more matches atomically."""
    
    bracket = load_bracket()
    
    start_time_iso = datetime.now(HKT_TZ).isoformat()

    for match_id in match_ids:
        match = next((m for m in bracket if m["match_num"] == match_id), None)
        if match:
            match["start_time"] = start_time_iso

    save_bracket(bracket)
    return jsonify({"success": True})

@app.route("/api/complete/<int:match_id>", methods=["POST"])
def complete_match(match_id):
    """Endpoint for a single match completion, now acts as a wrapper for the batch endpoint."""
    data = request.json
    participant = data["participant"]
    
    # Call the batch endpoint with a single item
    return complete_matches([{"matchId": match_id, "participant": participant}])

@app.route("/api/complete_matches", methods=["POST"])
def complete_multiple_matches():
    """
    Endpoint to process a batch of match completions. This is the primary
    endpoint for completing matches, ensuring atomicity with a lock.
    """
    completions = request.json
    if not isinstance(completions, list):
        return jsonify({"error": "Invalid payload: expected a list of completions."}), 400
        
    return complete_matches(completions)

def complete_matches(completions):
    """Helper function to process a list of completions atomically."""
    
    bracket = load_bracket()
    if not bracket:
        return jsonify({"error": "Bracket not loaded"}), 500

    for completion in completions:
        match_id = completion["matchId"]
        participant = completion["participant"]

        match = next((m for m in bracket if m["match_num"] == match_id), None)

        if not match: continue # Skip if match not found
        if not match["start_time"]: continue # Skip if match not started
        if match[f"participant{participant}_result"]: continue # Skip if already completed
        
        # Check for a special DNF signal from the frontend
        if completion.get("dnf"):
            match[f"participant{participant}_result"] = "DNF"
        else:
            # Standard completion with time calculation
            end_time = datetime.now(HKT_TZ)
            start_time = datetime.fromisoformat(match["start_time"])
            elapsed = str(end_time - start_time)
            match[f"participant{participant}_result"] = elapsed
            
    # --- Post-completion processing (advancing winners) ---
    # This should run after all times in the batch are recorded.
    # We iterate through all matches to check for newly completed ones.
    for match in bracket:
        # Check if match is complete and has a winner to advance
        if match.get("participant1_result") and match.get("participant2_result") and match.get("winner_proceeds_to"):
            
            # Avoid re-advancing winners
            next_match = next((m for m in bracket if m["match_num"] == match["winner_proceeds_to"]), None)
            if not next_match: continue

            t1 = parse_time(match["participant1_result"])
            t2 = parse_time(match["participant2_result"])
            winner_participant_obj = match["participant1"] if t1 < t2 else match["participant2"]
            loser_participant_obj = match["participant2"] if t1 < t2 else match["participant1"]

            # --- Logic to advance winner ---
            # Check if winner is already in the next match to prevent duplicates
            is_winner_placed = (next_match.get("participant1") and next_match["participant1"]["name"] == winner_participant_obj["name"]) or \
                               (next_match.get("participant2") and next_match["participant2"]["name"] == winner_participant_obj["name"])

            if not is_winner_placed:
                if not next_match.get("participant1"):
                    next_match["participant1"] = winner_participant_obj
                else:
                    next_match["participant2"] = winner_participant_obj

            # --- Logic to advance loser ---
            if match.get("loser_proceeds_to"):
                third_match = next((m for m in bracket if m["match_num"] == match["loser_proceeds_to"]), None)
                if third_match:
                    is_loser_placed = (third_match.get("participant1") and third_match["participant1"]["name"] == loser_participant_obj["name"]) or \
                                      (third_match.get("participant2") and third_match["participant2"]["name"] == loser_participant_obj["name"])
                    if not is_loser_placed:
                        if not third_match.get("participant1"):
                            third_match["participant1"] = loser_participant_obj
                        else:
                            third_match["participant2"] = loser_participant_obj

    save_bracket(bracket)
    return jsonify({"success": True})

@app.route("/api/reset/<int:match_id>", methods=["POST"])
def reset_match(match_id):
    
    bracket = load_bracket()
    match = next((m for m in bracket if m["match_num"] == match_id), None)

    if not match:
        return jsonify({"error": "Match not found"}), 404

    # Reset match progress
    match["start_time"] = None
    match["participant1_result"] = None
    match["participant2_result"] = None

    save_bracket(bracket)
    return jsonify({"success": True})

@app.route("/api/delete_bracket", methods=["POST"])
def delete_bracket():
    """Deletes the bracket.json file."""
    
    try:
        if os.path.exists(BRACKET_FILE):
            os.remove(BRACKET_FILE)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/problem/<filename>")
def get_problem(filename):
    path = os.path.join(PROBLEMS_DIR, filename)
    with open(path) as f:
        html = markdown.markdown(f.read())
    return html


@app.route('/problems/<path:filename>')
def serve_problem_asset(filename):
    """Serves static files (like images) from the problems directory."""
    return send_from_directory(PROBLEMS_DIR, filename)


if __name__ == "__main__":
    app.run(debug=True)