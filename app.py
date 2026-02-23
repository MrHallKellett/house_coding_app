
import os
import json
import random
from datetime import datetime
from flask import Flask, render_template, jsonify, request
import markdown

app = Flask(__name__)

BRACKET_FILE = "bracket.json"

PROBLEMS_DIR = "problems"


# -----------------------------
# Utility Functions
# -----------------------------

def parse_time(time_str):
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


def save_bracket(bracket):
    with open(BRACKET_FILE, "w") as f:
        json.dump(bracket, f, indent=4)




def generate_single_elim(participants):

    random.shuffle(participants)

    problems = [f for f in os.listdir(PROBLEMS_DIR) if f.endswith(".md")]

    n = len(participants)

    if (n & (n - 1)) != 0:
        raise ValueError("Participants must be a power of 2")

    total_matches = n - 1
    matches = []

    # --- Create empty matches first ---
    for match_num in range(1, total_matches + 1):
        matches.append({
            "match_num": match_num,
            "winner_proceeds_to": None,
            "loser_proceeds_to": None,
            "problem": random.choice(problems),
            "participant1": None,
            "participant2": None,
            "participant1_result": None,
            "participant2_result": None,
            "start_time": None
        })

    # --- Fill first round ---
    first_round_matches = n // 2

    for i in range(first_round_matches):
        matches[i]["participant1"] = participants[i*2]
        matches[i]["participant2"] = participants[i*2 + 1]

    # --- Wire winners correctly ---
    current_round_start = 0
    current_round_size = first_round_matches
    next_match_index = first_round_matches

    while current_round_size > 1:

        for i in range(0, current_round_size, 2):
            parent_index = next_match_index + (i // 2)

            matches[current_round_start + i]["winner_proceeds_to"] = parent_index + 1
            matches[current_round_start + i + 1]["winner_proceeds_to"] = parent_index + 1

        current_round_start = next_match_index
        current_round_size //= 2
        next_match_index += current_round_size

    # --- Add 3rd place playoff ---    
    if n >= 4:
        # The semi-finals are the two matches that feed into the final match.
        final_match_num = total_matches
        semi_final_matches_indices = [i for i, m in enumerate(matches) if m.get("winner_proceeds_to") == final_match_num]

        third_place_match_num = len(matches) + 1

        matches.append({
            "match_num": third_place_match_num,
            "winner_proceeds_to": None,
            "loser_proceeds_to": None,
            "problem": random.choice(problems),
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

def generate_double_elim(participants):
    """
    Generates a double-elimination bracket for a power-of-two number of participants.
    """
    random.shuffle(participants)
    problems = [f for f in os.listdir(PROBLEMS_DIR) if f.endswith(".md")]
    n = len(participants)

    if (n & (n - 1)) != 0 or n < 4:
        raise ValueError("Double elimination requires a power of 2 with at least 4 participants.")

    # --- 1. Generate Upper Bracket ---
    upper_matches = generate_single_elim(participants)
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
        lower_matches.append({
            "match_num": match_num_counter,
            "winner_proceeds_to": None,
            "loser_proceeds_to": None,
            "problem": random.choice(problems),
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
    matches.append({
        "match_num": grand_final_num,
        "winner_proceeds_to": None,
        "loser_proceeds_to": None,
        "problem": random.choice(problems),
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

def generate_hybrid_elim(participants):
    """
    Generates a bracket for 12 or 24 participants.
    Runs 1v1 rounds until 3 participants remain, then creates a 3-way
    round-robin final.
    """
    random.shuffle(participants)
    problems = [f for f in os.listdir(PROBLEMS_DIR) if f.endswith(".md")]
    n = len(participants)

    if n not in [12, 24]:
        raise ValueError("Hybrid elimination only supports 12 or 24 participants.")

    matches = []
    match_num_counter = 1
    current_participants = list(participants)
    last_round_match_indices = []

    while len(current_participants) > 3:
        num_matches_in_round = len(current_participants) // 2
        next_round_participants = []
        current_round_match_indices = []

        for i in range(num_matches_in_round):
            match = {
                "match_num": match_num_counter,
                "winner_proceeds_to": None, # Will be wired up later
                "loser_proceeds_to": None,
                "problem": random.choice(problems),
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
        current_participants = [f"Winner of M{i+1}" for i in range(num_matches_in_round)]

    # --- Create 3-way Round-Robin Final ---
    finalists_placeholders = current_participants
    sub_matches = []
    for i in range(3):
        sub_match = {
            "match_num": match_num_counter,
            "problem": random.choice(problems),
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
        "sub_matches": [m["match_num"] for m in sub_matches],
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
    data = request.json
    elim_type = data["type"]

    if not os.path.exists("participants.txt"):
        return jsonify({"error": "participants.txt missing"}), 400

    with open("participants.txt") as f:
        participants = [p.strip() for p in f if p.strip()]

    n = len(participants)
    if elim_type == "double":
        bracket = generate_double_elim(participants)
    elif elim_type == "single" and (n & (n - 1)) == 0 and n != 0: # Power of 2
        bracket = generate_single_elim(participants)    
    elif n in [12, 24]:
        bracket = generate_hybrid_elim(participants)
    else:
        return jsonify({"error": f"Unsupported number of participants: {n}. Please use a power of 2, 12, or 24."}), 400

    save_bracket(bracket)
    return jsonify(bracket)


@app.route("/match/<int:match_id>")
def match_page(match_id):
    return render_template("match.html", match_id=match_id)


@app.route("/api/match/<int:match_id>")
def get_match(match_id):
    bracket = load_bracket()
    match = next(m for m in bracket if m["match_num"] == match_id)
    return jsonify(match)


@app.route("/api/start/<int:match_id>", methods=["POST"])
def start_match(match_id):

    bracket = load_bracket()

    match = next((m for m in bracket if m["match_num"] == match_id), None)

    if not match:
        return jsonify({"error": "Match not found"}), 404

    match["start_time"] = datetime.utcnow().isoformat()

    save_bracket(bracket)

    return jsonify({"success": True})

@app.route("/api/complete/<int:match_id>", methods=["POST"])
def complete_match(match_id):

    data = request.json
    participant = data["participant"]

    bracket = load_bracket()

    match = next((m for m in bracket if m["match_num"] == match_id), None)

    if not match:
        return jsonify({"error": "Match not found"}), 404

    if not match["start_time"]:
        return jsonify({"error": "Match not started"}), 400

    end_time = datetime.utcnow()
    start_time = datetime.fromisoformat(match["start_time"])

    elapsed = str(end_time - start_time)

    if participant == 1:
        match["participant1_result"] = elapsed
    else:
        match["participant2_result"] = elapsed

    # Decide winner automatically if both finished
    if match["participant1_result"] and match["participant2_result"]:

        t1 = parse_time(match["participant1_result"])
        t2 = parse_time(match["participant2_result"])

        winner_name = (
            match["participant1"]
            if t1 < t2
            else match["participant2"]
        )

        # --- Advance winner (Standard Match) ---
        if match["winner_proceeds_to"]:
            next_match = next(
                m for m in bracket
                if m["match_num"] == match["winner_proceeds_to"]
            )

            # If next match is a 3-way final, populate its sub-matches
            if next_match.get("match_type") == "three_way_round_robin":
                # This is complex. We need to find all 3 finalists.
                semi_final_matches = [m for m in bracket if m.get("winner_proceeds_to") == next_match["match_num"]]
                finalists = []
                for sf_match in semi_final_matches:
                    if sf_match["participant1_result"] and sf_match["participant2_result"]:
                        sf_t1 = parse_time(sf_match["participant1_result"])
                        sf_t2 = parse_time(sf_match["participant2_result"])
                        finalists.append(sf_match["participant1"] if sf_t1 < sf_t2 else sf_match["participant2"])

                if len(finalists) == 3:
                    # We have all 3 finalists, populate the round robin
                    p1, p2, p3 = finalists[0], finalists[1], finalists[2]
                    sub_match_nums = next_match["sub_matches"]
                    
                    sub_match_1 = next(m for m in bracket if m["match_num"] == sub_match_nums[0])
                    sub_match_1['participant1'] = p1
                    sub_match_1['participant2'] = p2

                    sub_match_2 = next(m for m in bracket if m["match_num"] == sub_match_nums[1])
                    sub_match_2['participant1'] = p2
                    sub_match_2['participant2'] = p3

                    sub_match_3 = next(m for m in bracket if m["match_num"] == sub_match_nums[2])
                    sub_match_3['participant1'] = p3
                    sub_match_3['participant2'] = p1

            # If next match is a standard match
            else:
                if not next_match["participant1"]:
                    next_match["participant1"] = winner_name
                else:
                    next_match["participant2"] = winner_name
        
        # --- Check for 3-way final completion ---
        parent_3_way_match = next((m for m in bracket if m.get("match_type") == "three_way_round_robin" and match_id in m.get("sub_matches", [])), None)
        if parent_3_way_match:
            sub_matches = [m for m in bracket if m["match_num"] in parent_3_way_match["sub_matches"]]
            if all(m["participant1_result"] and m["participant2_result"] for m in sub_matches):
                # All sub-matches are complete, find the overall winner
                wins = {}
                for sub in sub_matches:
                    t1 = parse_time(sub["participant1_result"])
                    t2 = parse_time(sub["participant2_result"])
                    sub_winner = sub["participant1"] if t1 < t2 else sub["participant2"]
                    wins[sub_winner] = wins.get(sub_winner, 0) + 1
                
                # The winner is the one with 2 wins
                overall_winner = max(wins, key=wins.get)
                parent_3_way_match["winner"] = overall_winner
        
        loser_name = (
            match["participant2"]
            if winner_name == match["participant1"]
            else match["participant1"]
        )

        # Advance loser to 3rd place if exists
        if match.get("loser_proceeds_to"):
            third_match = next(
                m for m in bracket
                if m["match_num"] == match["loser_proceeds_to"]
            )

            if not third_match["participant1"]:
                third_match["participant1"] = loser_name
            else:
                third_match["participant2"] = loser_name

    save_bracket(bracket)
    return jsonify({"success": True})

@app.route("/api/problem/<filename>")
def get_problem(filename):
    path = os.path.join(PROBLEMS_DIR, filename)
    with open(path) as f:
        html = markdown.markdown(f.read())
    return html


if __name__ == "__main__":
    app.run(debug=True)