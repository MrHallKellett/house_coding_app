async function loadBracket() {
    const res = await fetch("/api/bracket");
    const data = await res.json();

    if (data.error) {
        document.getElementById("createSection").style.display = "block";
        return;
    }

    renderBracketSVG(data); // This function now acts as a dispatcher
}

async function createBracket(type) {
    const res = await fetch("/api/create_bracket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type })
    });

    const data = await res.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    location.reload();
}


/* -----------------------------------------
   SVG BRACKET RENDERER
------------------------------------------*/
function renderBracketSVG(data) { // Renamed 'matches' to 'data' for clarity

    const container = document.getElementById("bracket");
    container.innerHTML = "";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    // svg.setAttribute("height", "auto"); // Removed: height will be adjusted later
    container.appendChild(svg);

    const matchesByNum = Object.fromEntries(data.map(m => [m.match_num, m]));
    const threeWayFinal = data.find(m => m.match_type === 'three_way_round_robin');

    const isDoubleElim = data.some(m => m.bracket === 'lower' || m.is_grand_final);

    if (threeWayFinal) {
        return renderHybridBracket(svg, data, matchesByNum, threeWayFinal);
    }

    if (isDoubleElim) {
        return renderDoubleElimBracket(svg, data, matchesByNum);
    }

    // --- Standard Single Elimination Bracket Rendering (if not hybrid) ---
    const BOX_WIDTH = 180; // Original value for single elim
    const BOX_HEIGHT = 60;
    const HORIZONTAL_SPACING = 220; // Original value for single elim
    const VERTICAL_SPACING = 40;

    const FINAL_SCALE = 1.5;
    const THIRD_PLACE_SPACING = 80;

    // Identify special matches
    const finalMatch = data.find( // Use 'data' here
        m => !m.winner_proceeds_to && !m.is_third_place
    );

    const thirdPlaceMatch = data.find( // Changed 'matches' to 'data'
        m => m.is_third_place
    );

    // Build rounds EXCLUDING third place
    const rounds = {};
    data // Use 'data' here
        .filter(m => !m.is_third_place)
        .forEach(match => { // Changed 'matches' to 'data'
            const round = getRound(match, data);
            if (!rounds[round]) rounds[round] = [];
            rounds[round].push(match);
        });

    const roundNumbers = Object.keys(rounds)
        .map(Number)
        .sort((a, b) => a - b);

    const firstRoundCount = rounds[1].length;

    const totalHeight = firstRoundCount * (BOX_HEIGHT + VERTICAL_SPACING);

    const svgWidth = roundNumbers.length * HORIZONTAL_SPACING + 400;

    const svgHeight = totalHeight + 300; // Add some padding

    // Set SVG dimensions for single elimination
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

    const positions = {};

    // -----------------------------
    // ROUND LABELS
    // -----------------------------
    const getRoundName = (roundNum, totalRounds) => {
        if (roundNum === totalRounds) return "Final";
        if (roundNum === totalRounds - 1) return "Semi-Finals";
        const matchesInRound = Math.pow(2, totalRounds - roundNum);
        if (matchesInRound === 4) return "Quarter-Finals";
        return `Round ${roundNum}`;
    };

    roundNumbers.forEach(r => {
        const x = 50 + (r - 1) * HORIZONTAL_SPACING;
        const y = 25; // Position labels at the top
        const roundName = getRoundName(r, roundNumbers.length);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x + BOX_WIDTH / 2);
        text.setAttribute("y", y);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "16");
        text.setAttribute("font-weight", "bold");
        text.textContent = roundName;
        svg.appendChild(text);
    });
    // -----------------------------
    // FIRST ROUND
    // -----------------------------
    rounds[1].forEach((match, i) => {
        const x = 50; // Initial X offset
        const y = 50 + i * (BOX_HEIGHT + VERTICAL_SPACING);

        positions[match.match_num] = {
            x,
            y,
            width: BOX_WIDTH,
            height: BOX_HEIGHT
        };

        drawMatchBox(svg, match, x, y, BOX_WIDTH, BOX_HEIGHT);
    });

    // -----------------------------
    // OTHER ROUNDS (normal + final)
    // -----------------------------
    for (let r = 2; r <= roundNumbers.length; r++) {

        rounds[r].forEach(match => {
            // Use 'data' here
            const children = data.filter(
                m => m.winner_proceeds_to === match.match_num
            );

            if (children.length !== 2) return;

            const y1 = positions[children[0].match_num].y;
            const y2 = positions[children[1].match_num].y;
            const centerY = (y1 + y2) / 2;

            let width = BOX_WIDTH;
            let height = BOX_HEIGHT;
            let borderWidth = 2;

            const isFinal =
                finalMatch &&
                match.match_num === finalMatch.match_num;

            if (isFinal) { // Scale final match box
                width *= FINAL_SCALE;
                height *= FINAL_SCALE;
                borderWidth = 4;
            }

            const x = (r - 1) * HORIZONTAL_SPACING + 50; // X position for this round

            let y = centerY;

            if (isFinal) {
                y -= (height - BOX_HEIGHT) / 2;
            }

            positions[match.match_num] = {
                x,
                y,
                width,
                height
            };

            drawMatchBox(
                svg,
                match,
                x,
                y,
                width,
                height,
                borderWidth
            );
        });
    }

    // -----------------------------
    // THIRD PLACE (manually positioned)
    // -----------------------------
    if (thirdPlaceMatch && finalMatch) {

        const finalPos = positions[finalMatch.match_num];

        const width = BOX_WIDTH;
        const height = BOX_HEIGHT;

        const x = finalPos.x;
        const y = finalPos.y + finalPos.height + THIRD_PLACE_SPACING;

        positions[thirdPlaceMatch.match_num] = {
            x,
            y,
            width,
            height
        };

        drawMatchBox(
            svg,
            thirdPlaceMatch,
            x,
            y,
            width,
            height,
            2
        );
    }

    // -----------------------------
    // CONNECTORS
    // -----------------------------
    data.forEach(match => { // Use 'data' here

        const from = positions[match.match_num];
        if (!from) return;

        // Winner connections (solid)
        if (match.winner_proceeds_to) {
            const to = positions[match.winner_proceeds_to];
            if (to) {
                drawConnector(
                    svg,
                    from.x + from.width,
                    from.y + from.height / 2,
                    to.x,
                    to.y + to.height / 2,
                    false
                );
            }
        }

        // Loser connections (dashed)
        if (match.loser_proceeds_to) {
            const to = positions[match.loser_proceeds_to];
            if (to) {
                drawConnector(
                    svg,
                    from.x + from.width,
                    from.y + from.height / 2,
                    to.x,
                    to.y + to.height / 2,
                    true
                );
            }
        }
    });
}

function getRound(match, allMatches) { // Renamed 'matches' to 'allMatches' for clarity
    let round = 1;
    let current = match;

    while (true) {
        const parent = allMatches.find(m => // Use 'allMatches' here
            m.winner_proceeds_to === current.match_num && !m.is_third_place // Exclude 3rd place from round calculation
        );
        if (!parent) break;
        round++;
        current = parent;
    }
    return round;
}

function drawMatchBox(svg, match, x, y, width, height, borderWidth = 2) {

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("rx", 12);
    rect.setAttribute("fill", "#f9f9f9");
    rect.setAttribute("stroke", "#3b82f6");
    rect.setAttribute("stroke-width", borderWidth);

    svg.appendChild(rect);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    text.setAttribute("x", x + 10);
    text.setAttribute("y", y + 25);
    text.setAttribute("font-size", "14");
    text.setAttribute("fill", "#111");

    text.textContent =
        `${match.participant1 || "TBD"} vs ${match.participant2 || "TBD"}`;

    svg.appendChild(text);
}

/**
 * Draws a connector line between two points.
 * Uses a polyline for cleaner right-angle turns.
 * @param {SVGElement} svg The SVG container.
 * @param {number} x1 Start X coordinate.
 * @param {number} y1 Start Y coordinate.
 * @param {number} x2 End X coordinate.
 * @param {number} y2 End Y coordinate.
 * @param {boolean} dashed Whether the line should be dashed.
 */
function drawConnector(svg, x1, y1, x2, y2, dashed = false) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    // Create a path that goes right, then down/up, then right
    const midX = x1 + (x2 - x1) / 2; // Horizontal midpoint
    line.setAttribute("points", `${x1},${y1} ${midX},${y1} ${midX},${y2} ${x2},${y2}`);
    line.setAttribute("stroke", "#333");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("fill", "none");

    if (dashed) {
        line.setAttribute("stroke-dasharray", "5,5");
    }
    svg.appendChild(line);
}

/**
 * Renders a hybrid elimination bracket with a 3-way round-robin final.
 * @param {SVGElement} svg The SVG container.
 * @param {Array<Object>} data All match data.
 * @param {Object} matchesByNum A map of match_num to match object.
 * @param {Object} threeWayFinal The special three-way round-robin match object.
 */
function renderHybridBracket(svg, data, matchesByNum, threeWayFinal) {
    const BOX_WIDTH = 150;
    const BOX_HEIGHT = 60;
    const V_SPACING = 40;
    const H_SPACING = 60;

    // Filter out matches that are part of the three-way final's sub_matches
    const regularMatches = data.filter(m =>
        !threeWayFinal.sub_matches.includes(m.match_num) && m.match_type !== 'three_way_round_robin'
    );

    const roundRobinSubMatches = threeWayFinal.sub_matches.map(num => matchesByNum[num]);

    const positions = {};
    let maxRoundX = 0;
    let maxBracketHeight = 0;

    // --- Calculate positions for regular elimination rounds ---
    const rounds = [];
    // Start with matches that have participants and are not placeholders
    let currentRoundMatches = regularMatches.filter(m => m.participant1 && !m.participant1.startsWith("Winner of M"));
    if (currentRoundMatches.length > 0) {
        rounds.push(currentRoundMatches);
    }

    // Build subsequent rounds until we hit the semi-finals leading to the 3-way final
    while (currentRoundMatches.length > 0) {
        const nextRoundMatchNums = new Set(currentRoundMatches.map(m => m.winner_proceeds_to).filter(num => num !== null));
        const nextRoundMatches = Array.from(nextRoundMatchNums)
            .map(num => matchesByNum[num])
            .filter(m => m && m.match_type !== 'three_way_round_robin' && !threeWayFinal.sub_matches.includes(m.match_num));

        if (nextRoundMatches.length === 0) break; // No more regular rounds
        rounds.push(nextRoundMatches);
        currentRoundMatches = nextRoundMatches;
    }

    // Position regular matches
    rounds.forEach((round, roundIndex) => {
        const x = roundIndex * (BOX_WIDTH + H_SPACING) + 50; // Initial X offset
        const roundHeight = round.length * (BOX_HEIGHT + V_SPACING);

        // Calculate vertical start position to center the bracket
        const startY = (maxBracketHeight / 2) - (roundHeight / 2); // This will be adjusted after first pass

        round.forEach((match, matchIndex) => {
            const matchY = 50 + matchIndex * (BOX_HEIGHT + V_SPACING); // Temporary Y for initial layout
            positions[match.match_num] = { x, y: matchY };
            if (matchY + BOX_HEIGHT > maxBracketHeight) maxBracketHeight = matchY + BOX_HEIGHT;
            if (x + BOX_WIDTH > maxRoundX) maxRoundX = x + BOX_WIDTH;
        });
    });

    // Recalculate Y positions to center the bracket vertically
    const bracketCenterY = maxBracketHeight / 2;
    rounds.forEach((round, roundIndex) => {
        const roundHeight = round.length * (BOX_HEIGHT + V_SPACING);
        const startY = bracketCenterY - (roundHeight / 2);
        round.forEach((match, matchIndex) => {
            positions[match.match_num].y = startY + matchIndex * (BOX_HEIGHT + V_SPACING);
        });
    });

    // --- Position 3-way Round-Robin Final ---
    const rrCenterX = maxRoundX + H_SPACING * 2 + BOX_WIDTH / 2;
    const rrCenterY = bracketCenterY; // Center vertically with the main bracket

    // Position sub-matches around the center point
    positions[roundRobinSubMatches[0].match_num] = { x: rrCenterX - BOX_WIDTH / 2, y: rrCenterY - BOX_HEIGHT * 1.5 - V_SPACING }; // Top
    positions[roundRobinSubMatches[1].match_num] = { x: rrCenterX - BOX_WIDTH - H_SPACING / 2, y: rrCenterY + BOX_HEIGHT / 2 }; // Bottom-left
    positions[roundRobinSubMatches[2].match_num] = { x: rrCenterX + H_SPACING / 2, y: rrCenterY + BOX_HEIGHT / 2 }; // Bottom-right

    // --- Position Final Winner Box ---
    const finalBoxWidth = BOX_WIDTH * 1.5;
    const finalBoxHeight = BOX_HEIGHT * 1.2;
    const finalX = rrCenterX - finalBoxWidth / 2;
    const finalY = rrCenterY + BOX_HEIGHT * 2 + V_SPACING * 2;
    const finalPos = { x: finalX, y: finalY, width: finalBoxWidth, height: finalBoxHeight };

    // --- Draw everything ---
    regularMatches.forEach(match => {
        const pos = positions[match.match_num];
        if (!pos) return;

        drawMatchBox(svg, match, pos.x, pos.y, BOX_WIDTH, BOX_HEIGHT);

        if (match.winner_proceeds_to) {
            const nextMatch = matchesByNum[match.winner_proceeds_to];
            if (nextMatch && nextMatch.match_type === 'three_way_round_robin') {
                // Connect semi-finals to the conceptual center of the RR
                drawConnector(svg, pos.x + BOX_WIDTH, pos.y + BOX_HEIGHT / 2, rrCenterX, rrCenterY);
            } else if (nextMatch) { // Standard connection
                const nextPos = positions[match.winner_proceeds_to];
                if (nextPos) {
                    drawConnector(svg, pos.x + BOX_WIDTH, pos.y + BOX_HEIGHT / 2, nextPos.x, nextPos.y + BOX_HEIGHT / 2);
                }
            }
        }
    });

    // Draw the round-robin sub-matches
    roundRobinSubMatches.forEach(subMatch => {
        const pos = positions[subMatch.match_num];
        if (pos) {
            drawMatchBox(svg, subMatch, pos.x, pos.y, BOX_WIDTH, BOX_HEIGHT);
            // Connect the conceptual center of the RR to each sub-match
            drawConnector(svg, rrCenterX, rrCenterY, pos.x + BOX_WIDTH / 2, pos.y);
        }
    });

    // --- Draw Final Winner Box ---
    const finalRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    finalRect.setAttribute("x", finalPos.x);
    finalRect.setAttribute("y", finalPos.y);
    finalRect.setAttribute("width", finalPos.width);
    finalRect.setAttribute("height", finalPos.height);
    finalRect.setAttribute("rx", 12);
    finalRect.setAttribute("fill", "#ffd700"); // Gold color
    finalRect.setAttribute("stroke", "#333");
    finalRect.setAttribute("stroke-width", "2");
    svg.appendChild(finalRect);

    const winnerText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    winnerText.setAttribute("x", finalPos.x + finalPos.width / 2);
    winnerText.setAttribute("y", finalPos.y + finalPos.height / 2 + 5);
    winnerText.setAttribute("text-anchor", "middle");
    winnerText.setAttribute("font-weight", "bold");
    winnerText.setAttribute("font-size", "18");
    winnerText.setAttribute("fill", "#111");
    winnerText.textContent = threeWayFinal.winner || 'CHAMPION';
    svg.appendChild(winnerText);

    // --- Line from RR center to Final Box ---
    drawConnector(svg, rrCenterX, rrCenterY + BOX_HEIGHT + V_SPACING, finalPos.x + finalPos.width / 2, finalPos.y);

    // --- Set SVG dimensions ---
    const finalSvgWidth = finalPos.x + finalPos.width + 50;
    const finalSvgHeight = finalPos.y + finalPos.height + 50;
    svg.setAttribute("width", finalSvgWidth);
    svg.setAttribute("height", finalSvgHeight);
    svg.setAttribute("viewBox", `0 0 ${finalSvgWidth} ${finalSvgHeight}`);
}

function createText(x, y, text) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("font-size", "12");
    el.setAttribute("fill", "#111827");
    el.textContent = text || "TBD";
    return el;
}

/**
 * Renders a double elimination bracket.
 * @param {SVGElement} svg The SVG container.
 * @param {Array<Object>} data All match data.
 * @param {Object} matchesByNum A map of match_num to match object.
 */
function renderDoubleElimBracket(svg, data, matchesByNum) {
    const BOX_WIDTH = 180;
    const BOX_HEIGHT = 60;
    const H_SPACING = 80;
    const V_SPACING = 30;

    const upperMatches = data.filter(m => m.bracket === 'upper');
    const lowerMatches = data.filter(m => m.bracket === 'lower');
    const grandFinal = data.find(m => m.is_grand_final);

    const positions = {};
    let maxSvgWidth = 0;
    let maxSvgHeight = 0;

    // --- 1. Position Upper Bracket ---
    const upperRounds = {};
    upperMatches.forEach(match => {
        let round = 1;
        let current = match;
        while (true) {
            const parent = upperMatches.find(p => p.winner_proceeds_to === current.match_num);
            if (!parent) break;
            current = parent;
            round++;
        }
        if (!upperRounds[round]) upperRounds[round] = [];
        upperRounds[round].push(match);
    });

    const upperRoundNumbers = Object.keys(upperRounds).map(Number).sort((a, b) => a - b);
    let lastUpperX = 0;

    upperRoundNumbers.forEach(r => {
        const round = upperRounds[r];
        const x = 50 + (r - 1) * (BOX_WIDTH + H_SPACING);
        lastUpperX = x;
        round.forEach((match, i) => {
            let y;
            if (r === 1) {
                y = 50 + i * (BOX_HEIGHT + V_SPACING);
            } else {
                const children = upperMatches.filter(c => c.winner_proceeds_to === match.match_num);
                const y1 = positions[children[0].match_num].y;
                const y2 = positions[children[1].match_num].y;
                y = (y1 + y2) / 2;
            }
            positions[match.match_num] = { x, y, width: BOX_WIDTH, height: BOX_HEIGHT };
            if (y + BOX_HEIGHT > maxSvgHeight) maxSvgHeight = y + BOX_HEIGHT;
        });
    });

    // --- 2. Position Lower Bracket ---
    const lowerRounds = {};
    let maxLowerRound = 0;
    lowerMatches.forEach(match => {
        let round = 1;
        let current = match;
        while (true) {
            const parent = lowerMatches.find(p => p.winner_proceeds_to === current.match_num);
            if (!parent) break;
            current = parent;
            round++;
        }
        if (!lowerRounds[round]) lowerRounds[round] = [];
        lowerRounds[round].push(match);
        if (round > maxLowerRound) maxLowerRound = round;
    });

    const lowerRoundNumbers = Object.keys(lowerRounds).map(Number).sort((a, b) => a - b);
    const lowerBracketYOffset = maxSvgHeight + 120;

    lowerRoundNumbers.forEach(r => {
        const round = lowerRounds[r];
        const x = 50 + (r - 1) * (BOX_WIDTH + H_SPACING);
        round.forEach((match, i) => {
            let y;
            const feedingMatches = data.filter(m => m.winner_proceeds_to === match.match_num || m.loser_proceeds_to === match.match_num);
            if (feedingMatches.length > 0) {
                y = feedingMatches.reduce((sum, m) => sum + positions[m.match_num].y, 0) / feedingMatches.length;
                if (feedingMatches.every(m => m.bracket === 'upper')) { // Dropping down
                    y += BOX_HEIGHT + V_SPACING * 2;
                }
            } else { // Should not happen, but as a fallback
                y = lowerBracketYOffset + i * (BOX_HEIGHT + V_SPACING);
            }
            positions[match.match_num] = { x, y, width: BOX_WIDTH, height: BOX_HEIGHT };
        });
    });

    // --- 3. Position Grand Final ---
    const upperFinalPos = positions[upperMatches.find(m => !m.winner_proceeds_to).match_num];
    const lowerFinalPos = positions[lowerMatches.find(m => !m.winner_proceeds_to).match_num];
    const finalX = Math.max(upperFinalPos.x, lowerFinalPos.x) + BOX_WIDTH + H_SPACING;
    const finalY = (upperFinalPos.y + lowerFinalPos.y) / 2;
    positions[grandFinal.match_num] = { x: finalX, y: finalY, width: BOX_WIDTH * 1.5, height: BOX_HEIGHT * 1.5 };

    // --- 4. Draw Everything ---
    data.forEach(match => {
        const pos = positions[match.match_num];
        if (!pos) return;
        drawMatchBox(svg, match, pos.x, pos.y, pos.width, pos.height);

        // Winner connections
        if (match.winner_proceeds_to) {
            const to = positions[match.winner_proceeds_to];
            if (to) {
                drawConnector(svg, pos.x + pos.width, pos.y + pos.height / 2, to.x, to.y + to.height / 2, false);
            }
        }
        // Loser connections
        if (match.loser_proceeds_to) {
            const to = positions[match.loser_proceeds_to];
            if (to) {
                const isDrop = match.bracket === 'upper' && matchesByNum[match.loser_proceeds_to].bracket === 'lower';
                // Custom path for dropping down
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                const startX = pos.x + pos.width / 2;
                const startY = pos.y + pos.height;
                const endX = to.x;
                const endY = to.y + to.height / 2;
                path.setAttribute("d", `M ${startX} ${startY} V ${startY + V_SPACING} H ${endX - H_SPACING/2} V ${endY} H ${endX}`);
                path.setAttribute("stroke", "#ef4444");
                path.setAttribute("stroke-width", "2");
                path.setAttribute("fill", "none");
                path.setAttribute("stroke-dasharray", "5,5");
                svg.appendChild(path);
            }
        }
    });

    // Set SVG size
    const finalPos = positions[grandFinal.match_num];
    svg.setAttribute("width", finalPos.x + finalPos.width + 50);
    svg.setAttribute("height", Math.max(...Object.values(positions).map(p => p.y + p.height)) + 50);
}


function formatName(name, result) {
    if (!name) return "TBD";
    if (!result) return name;
    return `${name} (${result})`;
}


/* -----------------------------------------
   MATCH PAGE LOGIC (unchanged)
------------------------------------------*/

async function loadMatch(matchId) {
    const res = await fetch(`/api/match/${matchId}`);
    const match = await res.json();

    const container = document.getElementById("matchContainer");
    container.innerHTML = `
        <h1>${match.participant1} vs ${match.participant2}</h1>
        <button onclick="startMatch(${matchId})">START PROBLEM</button>
        <button onclick="location.href='/'">BACK TO BRACKET</button>
        <div id="problemArea"></div>
        <br><br>
        <button onclick="complete(${matchId},1)">
            ✅ ${match.participant1} Completed
        </button>
        <button onclick="complete(${matchId},2)">
            ✅ ${match.participant2} Completed
        </button>
    `;
}

async function startMatch(matchId) {
    await fetch(`/api/start/${matchId}`, { method: "POST" });
    const matchRes = await fetch(`/api/match/${matchId}`);
    const match = await matchRes.json();
    const problem = await fetch(`/api/problem/${match.problem}`);
    document.getElementById("problemArea").innerHTML = await problem.text();
}

async function complete(matchId, participant) {
    await fetch(`/api/complete/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant })
    });

    alert("Time Recorded!");
    location.href = "/";
}


if (window.location.pathname === "/") {
    loadBracket();
} else if (window.location.pathname.startsWith("/match/")) {
    loadMatch(matchId);
}