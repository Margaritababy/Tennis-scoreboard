let incrementP1 = document.getElementById("increment-p1");
let incrementP2 = document.getElementById("increment-p2");

let pointsP1 = document.getElementById("points-p1");
let pointsP2 = document.getElementById("points-p2");

let gamesP1 = document.getElementById("games-p1");
let gamesP2 = document.getElementById("games-p2");

let setsP1 = document.getElementById("sets-p1");
let setsP2 = document.getElementById("sets-p2");

let points = [0, 0];
let games = [6, 5];
let sets = [0, 0];
let prevSets = [];
let tieBreak = false;
let point = 0
let matchWinner = 'none';


incrementP1.addEventListener('click', function() {
    if (matchWinner != 'none') {
        console.log('Game, Set, Match ');
    } else {
        tally_score(0, 1);
    }
});


incrementP2.addEventListener('click', function() {
    if (matchWinner != 'none') {
        console.log('Game, Set, Match ');
    } else {
        tally_score(1, 0);
    }
});


function tally_score(winner, loser) {
    let setWon = false;

    // Handle scoring
    if (tieBreak) {
        setWon = handleTieBreak(winner, loser); // Tiebreak logic
    } else {
        if (handleRegularPoint(winner, loser)) { // Regular scoring logic
            games[winner]++;
            points[winner] = 0;
            points[loser] = 0;

            // Check if heading to tiebreak
            if (games[winner] === 6 && games[loser] === 6) {
                tieBreak = true;
                console.log("Entering tiebreak...");
            }
        }
    }

    // Check if set won
    if (setWon || check_set(winner, loser)) {
        sets[winner]++;
        setWon = true;

        // Record and reset for the next set
        prevSets.push([...games]);
        games[0] = 0;
        games[1] = 0;
        tieBreak = false;
        console.log(`Player ${winner + 1} wins the set!`);
    }

    // Update visuals
    updateDisplay();

    if (setWon && sets[winner] >= 3) {
        console.log(`Player ${winner + 1} wins the match!`);
        matchWinner = winner;
    }
}


function handleRegularPoint(winner, loser) {
    if (points[winner] === "A") {
        return true;
    }
    if (points[loser] === "A") {
        points[loser] = 40; // Reset opponent's advantage to deuce
        console.log(`Deuce: Player ${loser + 1} loses advantage`);

    } else if (points[winner] === 40) {
        if (points[loser] === 40) {
            points[winner] = "A"; // Winner gains advantage
            console.log(`Advantage: Player ${winner + 1}`);
        } else {
            return true; // Winner wins the game
        }
    } else {
        points[winner] += 15; // Increment regular points
        if (points[winner] === 45) {
            points[winner] = 40; // Adjust invalid score (e.g., 45 is not a valid point)
        }
    }
    return false; // Continue regular play
}


function handleTieBreak(winner, loser) {
    points[winner]++; // Increment winner's points
    console.log(`Tiebreak point for player ${winner + 1}: ${points[winner]}`);

    // Check if the winner has enough points and a 2-point margin
    if (points[winner] >= 7 && points[winner] - points[loser] >= 2) {
        games[winner]++; // Player wins the game (and the set, if applicable)
        points[winner] = 0; // Reset points
        points[loser] = 0;
        return true; // Indicates the set is won
    }
    return false; // Continue tiebreak
}


function check_set(winner, loser) {
    // During a tiebreak
    if (tieBreak) {
        if (points[winner] >= 7 && points[winner] - points[loser] >= 2) {
            games[winner]++; // Winner gets the decisive game
            return true; // Set is won
        }
        return false; // Tiebreak continues
    }

    // Regular play (no tiebreak)
    if (games[winner] >= 6 && games[winner] - games[loser] >= 2) {
        return true; // Set is won
    }

    return false; // Set is not yet won
}


function updateSetsDisplay() {
    for (let i = 0; i < prevSets.length; i++) {
        document.getElementById(`set${i + 1}-p1`).textContent = prevSets[i][0];
        document.getElementById(`set${i + 1}-p2`).textContent = prevSets[i][1];
    }
}


function updateDisplay() {
    pointsP1.textContent = points[0];
    pointsP2.textContent = points[1];
    gamesP1.textContent = games[0];
    gamesP2.textContent = games[1];
    setsP1.textContent = sets[0];
    setsP2.textContent = sets[1];
    updateSetsDisplay();
}