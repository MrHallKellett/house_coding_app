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
        showToast(data.error, 'error');
        return;
    }

    location.reload();
}


/* -----------------------------------------
   SVG BRACKET RENDERER
------------------------------------------*/
function renderBracketSVG(data) { // Renamed 'matches' to 'data' for clarity

    const container = document.getElementById("bracket");
    const headerContainer = document.getElementById("bracket-header");
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
    const BOX_WIDTH = 180;
    const BOX_HEIGHT = 75; // Increased height to accommodate 3 lines of text
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
        const roundName = getRoundName(r, roundNumbers.length);

        const label = document.createElement("div");
        label.className = "round-label";
        label.style.left = `${x + BOX_WIDTH / 2}px`;
        label.textContent = roundName;
        headerContainer.appendChild(label);
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

    // Make the entire group clickable
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.style.cursor = "pointer";
    group.addEventListener("click", () => openMatchModal(match.match_num));

    const p1_name_display = getParticipantNameOnly(match.participant1);
    const p2_name_display = getParticipantNameOnly(match.participant2);
    const p1_time_display = getParticipantTimeOnly(match.participant1_result);
    const p2_time_display = getParticipantTimeOnly(match.participant2_result);
    const p1_house = getParticipantHouse(match.participant1);
    const p2_house = getParticipantHouse(match.participant2);
    const p1_color = getHouseColor(p1_house);
    const p2_color = getHouseColor(p2_house);
    const problem_text = formatProblemName(match.problem);

    // --- Grid-based text layout ---
    const col1_x = x + width * 0.25; // Center of left column
    const col2_x = x + width * 0.5;  // Center of middle column
    const col3_x = x + width * 0.75; // Center of right column

    const row1_y = y + 22; // Baseline for first row
    const row2_y = y + 42; // Baseline for second row
    const row3_y = y + 62; // Baseline for third row

    // Helper to create and append text elements
    const addText = (content, x_pos, y_pos, size, weight, fill, anchor = "middle", parent = group) => {
        const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
        el.setAttribute("x", x_pos);
        el.setAttribute("y", y_pos);
        el.setAttribute("font-size", size);
        el.setAttribute("font-weight", weight);
        el.setAttribute("fill", fill);
        el.setAttribute("text-anchor", anchor);
        el.textContent = content;
        parent.appendChild(el);
        return el;
    };

    // Helper to draw the name backgrounds
    const addNameBg = (x_pos, y_pos, color) => {
        const bg_width = width * 0.45; // 45% of the box width
        const bg_height = 22;
        const bg_rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bg_rect.setAttribute("x", x_pos - bg_width / 2);
        bg_rect.setAttribute("y", y_pos - bg_height / 2 - 4); // Adjust vertical position
        bg_rect.setAttribute("width", bg_width);
        bg_rect.setAttribute("height", bg_height);
        bg_rect.setAttribute("rx", 4);
        bg_rect.setAttribute("fill", color);
        group.appendChild(bg_rect);
    };

    // Row 1: Names
    if (p1_house !== 'N/A') {
        addNameBg(col1_x, row1_y, p1_color);
    }
    addText(p1_name_display, col1_x, row1_y, "14", "bold", p1_house !== 'N/A' ? "white" : "#111");

    addText("v", col2_x, row1_y, "12", "normal", "#6b7280");

    if (p2_house !== 'N/A') {
        addNameBg(col3_x, row1_y, p2_color);
    }
    addText(p2_name_display, col3_x, row1_y, "14", "bold", p2_house !== 'N/A' ? "white" : "#111");

    // Row 2: Times
    if (p1_time_display) {
        addText(p1_time_display, col1_x, row2_y, "12", "normal", "#333");
    }
    if (p2_time_display) {
        addText(p2_time_display, col3_x, row2_y, "12", "normal", "#333");
    }

    // Row 3: Problem Name
    addText(problem_text, col2_x, row3_y, "12", "normal", "#6b7280");

    svg.appendChild(group);
}

// Define house colors
const HOUSE_COLORS = {
    'Y': '#DAA520', // Dark Yellow (Goldenrod)
    'C': '#FF8C00', // Orange (DarkOrange)
    'B': '#4682B4', // Blue (SteelBlue)
    'M': '#228B22', // Dark Green (ForestGreen)
    'N/A': '#6B7280' // Default gray for unspecified house
};

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
    const BOX_HEIGHT = 75; // Increased height to accommodate 3 lines of text
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
    let currentRoundMatches = regularMatches.filter(m => m.participant1 && (typeof m.participant1 === 'string' ? !m.participant1.startsWith("Winner of M") : true));
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

function createTextSpan(text, dy = 0) {
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    // x attribute is removed to allow text-anchor to control alignment
    tspan.setAttribute("dy", `${dy}px`);
    tspan.textContent = text;
    return tspan;
}

/**
 * Renders a double elimination bracket.
 * @param {SVGElement} svg The SVG container.
 * @param {Array<Object>} data All match data.
 * @param {Object} matchesByNum A map of match_num to match object.
 */
function renderDoubleElimBracket(svg, data, matchesByNum) {
    const BOX_WIDTH = 180;
    const BOX_HEIGHT = 75; // Increased height to accommodate 3 lines of text
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

function getHouseColor(houseCode) {
    return HOUSE_COLORS[houseCode] || HOUSE_COLORS['N/A'];
}

function getParticipantHouse(participant_obj) {
    if (!participant_obj || typeof participant_obj === 'string') {
        return 'N/A';
    }
    // If it's an object, return the house
    return participant_obj.house;
}

function getParticipantNameOnly(participant_obj) {
    if (!participant_obj) return "TBD";
    // Handle cases where participant might be a string (e.g., "Winner of M...")
    if (typeof participant_obj === 'string') {
        if (participant_obj.startsWith("Winner of M")) return "TBD";
        return participant_obj;
    }
    // If it's an object, return the name
    return participant_obj.name;
}

function getParticipantTimeOnly(result) {
    if (!result) return "";
    // Format as H:MM:SS
    const parts = result.split(':');
    const h = parts[0];
    const m = parts[1];
    const s = parts[2].split('.')[0].padStart(2, '0');
    return `${h}:${m}:${s}`;
}

function formatProblemName(filename) {
    if (!filename) return '';
    // Converts 'some-problem.md' to 'Some Problem'
    return filename
        .replace('.md', '')
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

/* -----------------------------------------
   MATCH MODAL LOGIC
------------------------------------------*/

let matchTimerInterval = null; // Holds the setInterval for the live timer

async function openMatchModal(matchId) {
    const res = await fetch(`/api/match/${matchId}`);
    const match = await res.json();

    if (!match.participant1 || !match.participant2 || (typeof match.participant1 === 'string' && match.participant1.startsWith("Winner of"))) {
        showToast("This match is not ready yet.", 'info');
        return;
    }

    // Clear any previous timer when opening a new modal
    if (matchTimerInterval) clearInterval(matchTimerInterval);

    const modal = document.getElementById("matchModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");

    const p1_name_modal = typeof match.participant1 === 'object' ? match.participant1.name : match.participant1;
    const p2_name_modal = typeof match.participant2 === 'object' ? match.participant2.name : match.participant2;    
    const p1_house_modal = typeof match.participant1 === 'object' ? match.participant1.house : 'N/A';
    const p2_house_modal = typeof match.participant2 === 'object' ? match.participant2.house : 'N/A';

    modalTitle.innerHTML = `
        <div class="participant-actions" style="justify-content: center; align-items: center;">
            <div class="participant-column">
                <button id="p1CompleteBtn" class="participant-btn" style="background-color:${getHouseColor(p1_house_modal)};" onclick="completeMatch(${matchId}, 1)" disabled>${p1_name_modal}</button>
                <div id="p1Time" class="time-display">${match.participant1_result ? getParticipantTimeOnly(match.participant1_result) : ''}</div>
            </div>
            <span class="vs-separator">vs</span>
            <div class="participant-column">
                <button id="p2CompleteBtn" class="participant-btn" style="background-color:${getHouseColor(p2_house_modal)};" onclick="completeMatch(${matchId}, 2)" disabled>${p2_name_modal}</button>
                <div id="p2Time" class="time-display">${match.participant2_result ? getParticipantTimeOnly(match.participant2_result) : ''}</div>
            </div>
        </div>
    `;

    modalBody.innerHTML = `
        <div class="match-controls">
            <button id="startBtn" class="start-btn" onclick="startMatchAnimation(${matchId})" ${match.start_time ? 'disabled' : ''}>Start</button>
            <span id="startTimeDisplay" style="margin-left: 1rem; font-weight: bold;">${match.start_time ? `Started at: ${new Date(match.start_time).toLocaleTimeString()}` : ''}</span>
            <button id="returnBtn" class="return-btn" onclick="closeModal()" style="display: none;">Return to Bracket & Refresh</button>
        </div>
        <br>
        <hr>
        <div id="problemArea"></div>
        <div style="text-align: right; margin-top: 2rem;">
            <button class="reset-btn" onclick="resetMatch(${matchId})">Reset Match</button>
        </div>
    `;

    modal.style.display = "flex";

    // Get the problemArea element AFTER it has been added to the DOM
    const problemArea = document.getElementById("problemArea");

    // Load problem immediately when modal opens
    if (match.problem) {
        const problemHtml = await (await fetch(`/api/problem/${match.problem}`)).text();
        
        // If the match has not started, show only the title.
        // Otherwise, show the full problem.
        if (!match.start_time) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = problemHtml;
            const titleElement = tempDiv.querySelector('h1');
            const titleHtml = titleElement ? titleElement.outerHTML : '<h1>Problem</h1>';
            
            // Store the rest of the content in a hidden div
            if (titleElement) titleElement.remove();
            const restOfContent = tempDiv.innerHTML;

            problemArea.innerHTML = `${titleHtml}<div id="problem-body" style="display: none;">${restOfContent}</div>`;
        } else {
            problemArea.innerHTML = problemHtml;
        }

    } else {
        problemArea.innerHTML = ""; // Clear old problem
    }

    // If match has already started, enable the completion buttons
    if (match.start_time) {
        document.getElementById('p1CompleteBtn').disabled = !!match.participant1_result;
        document.getElementById('p2CompleteBtn').disabled = !!match.participant2_result;

        // If match is in progress but not finished, start the timer
        if (!match.participant1_result || !match.participant2_result) {
            const startTime = new Date(match.start_time).getTime();
            const timerDisplay = document.getElementById("startTimeDisplay");

            matchTimerInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const seconds = Math.floor((elapsed / 1000) % 60).toString().padStart(2, '0');
                const minutes = Math.floor((elapsed / (1000 * 60)) % 60).toString().padStart(2, '0');
                const hours = Math.floor(elapsed / (1000 * 60 * 60));
                timerDisplay.textContent = `Time Elapsed: ${hours}:${minutes}:${seconds}`;
            }, 1000);
        } else {
            document.getElementById("startTimeDisplay").textContent = "Match Complete";
        }

        // If match is fully complete, show the return button
        if (match.participant1_result && match.participant2_result) {
            document.getElementById('startBtn').style.display = 'none';
            document.getElementById('startTimeDisplay').style.display = 'none';
            document.getElementById('returnBtn').style.display = 'inline-block';
        }
    }
}

function closeModal() {
    document.getElementById("matchModal").style.display = "none";
    if (matchTimerInterval) clearInterval(matchTimerInterval);
    location.reload();
}

async function startMatchAnimation(matchId) {
    const startBtn = document.getElementById("startBtn");
    startBtn.style.display = 'none'; // Correctly hide the start button
    const countdownDisplay = document.getElementById("countdownDisplay");
    const modalControls = document.getElementById("modalBody"); // The div containing buttons, etc.
    modalControls.style.display = "none"; // Hide controls during countdown

    const countdown = (num) => {
        if (num > 0) {
            countdownDisplay.innerHTML = `<div class="countdown">${num}</div>`;
            setTimeout(() => countdown(num - 1), 1000);
        } else {
            countdownDisplay.innerHTML = `<div class="countdown">CODE!</div>`;
            setTimeout(async () => {
                countdownDisplay.innerHTML = ''; // Clear countdown
                modalControls.style.display = "block"; // Show controls again
                await startMatch(matchId);
            }, 1000);
        }
    };

    countdown(3);
}

async function startMatch(matchId) { // Renamed from startMatchAnimation
    await fetch(`/api/start/${matchId}`, { method: "POST" });
    const matchRes = await fetch(`/api/match/${matchId}`);

    // Start the live timer
    const startTime = Date.now(); // Use client's current time for live display
    const timerDisplay = document.getElementById("startTimeDisplay");

    if (matchTimerInterval) clearInterval(matchTimerInterval); // Clear any existing timer

    matchTimerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const seconds = Math.floor((elapsed / 1000) % 60).toString().padStart(2, '0');
        const minutes = Math.floor((elapsed / (1000 * 60)) % 60).toString().padStart(2, '0');
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        timerDisplay.textContent = `Time Elapsed: ${hours}:${minutes}:${seconds}`;
    }, 1000);

    // Enable participant buttons
    document.getElementById("p1CompleteBtn").disabled = false;
    document.getElementById("p2CompleteBtn").disabled = false;
    document.getElementById("startBtn").style.display = 'none';

    // Reveal the full problem description
    const problemBody = document.getElementById("problem-body");
    if (problemBody) {
        problemBody.style.display = 'block';
    }
}

async function completeMatch(matchId, participant) {
    const res = await fetch(`/api/complete/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant })
    });

    if (!res.ok) {
        const err = await res.json();
        showToast(`Error: ${err.error}`, 'error');
        return;
    }

    // Re-fetch match data to get the new times
    const matchRes = await fetch(`/api/match/${matchId}`);
    const match = await matchRes.json();

    // Update UI with times
    document.getElementById(`p${participant}Time`).textContent = getParticipantTimeOnly(match[`participant${participant}_result`]);
    document.getElementById(`p${participant}CompleteBtn`).disabled = true;

    // If both are done, close the modal and refresh
    if (match.participant1_result && match.participant2_result) {
        // Hide start controls and show the return button
        if (matchTimerInterval) clearInterval(matchTimerInterval);
        document.getElementById("startTimeDisplay").textContent = "Match Complete";
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('startTimeDisplay').style.display = 'none';
        document.getElementById('returnBtn').style.display = 'inline-block';
    }
}

async function resetMatch(matchId) {
    showConfirm("Are you sure you want to reset this match? All times will be erased.", async () => {
        const res = await fetch(`/api/reset/${matchId}`, { method: "POST" });

        if (!res.ok) {
            const err = await res.json();
            showToast(`Error resetting match: ${err.error}`, 'error');
            return;
        }

        // Stop the timer on reset
        if (matchTimerInterval) clearInterval(matchTimerInterval);

        // --- Update UI to reflect reset state ---
        document.getElementById('p1Time').textContent = '';
        document.getElementById('p2Time').textContent = '';
        document.getElementById('p1CompleteBtn').disabled = true;
        document.getElementById('p2CompleteBtn').disabled = true;

        const startBtn = document.getElementById('startBtn');
        startBtn.style.display = 'inline-block';
        startBtn.disabled = false;
        
        document.getElementById('startTimeDisplay').textContent = '';
        document.getElementById('startTimeDisplay').style.display = 'inline-block';
        document.getElementById('returnBtn').style.display = 'none';

        showToast("Match has been reset.", 'success');
    });
}

if (window.location.pathname === "/") {
    loadBracket();
}

/* -----------------------------------------
   UI HELPERS (TOASTS & CONFIRM MODAL)
------------------------------------------*/

function showToast(message, type = 'info') { // types: info, success, error
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000); // Remove after 5 seconds
}

function showConfirm(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const msgEl = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    msgEl.textContent = message;

    const close = () => modal.style.display = 'none';

    const confirmHandler = () => {
        close();
        onConfirm();
    };

    // Use .cloneNode(true) to remove old event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    newConfirmBtn.addEventListener('click', confirmHandler);

    cancelBtn.onclick = close;

    modal.style.display = 'flex';
}

/* -----------------------------------------
   GLOBAL EVENT LISTENERS
------------------------------------------*/

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const matchModal = document.getElementById('matchModal');
        const confirmModal = document.getElementById('confirmModal');

        if (matchModal.style.display === 'flex') {
            if (matchTimerInterval) clearInterval(matchTimerInterval);
            matchModal.style.display = 'none'; // Just hide, don't reload
        } else if (confirmModal.style.display === 'flex') {
            confirmModal.style.display = 'none'; // Same as clicking "Cancel"
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const bracket = document.getElementById('bracket');
    const bracketHeader = document.getElementById('bracket-header');
    if (bracket && bracketHeader) {
        bracket.addEventListener('scroll', () => {
            bracketHeader.scrollLeft = bracket.scrollLeft;
        });
    }
});