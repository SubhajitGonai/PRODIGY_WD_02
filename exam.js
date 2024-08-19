const WINNER_PREFIX = 'W';
const LOSER_PREFIX = 'L';
let currentPlayer = 'X';
let gameActive = true;
const gameState = Array(9).fill('');
let tieCount = 0;
let matches = [];
let tournamentEnded = false; // Flag to track if the tournament has ended


document.addEventListener('DOMContentLoaded', () => {
    const clickSound = new Audio('music/click.mp3'); // Ensure this path is correct

    // Add event listener to the Schedule button
    document.querySelector('#input-section button').addEventListener('click', () => {
        playBipSound();
        scheduleTournament();
    });

    // Add event listener to the player count input box
    document.getElementById('player-count').addEventListener('change', playBipSound);
});

function playBipSound() {
    const audio = new Audio('music/click.mp3'); // Ensure this path is correct
    audio.currentTime = 0; // Restart the sound
    audio.play();
}


function scheduleTournament() {
    const playerCount = parseInt(document.getElementById('player-count').value);

    if (playerCount < 4 || playerCount > 7) {
        alert('Number of players must be between 4 and 7.');
        return;
    }

    matches = generateTournamentMatches(playerCount);
    currentMatchId = 1;
    displayMatches();

    document.getElementById('tic-tac-toe-game').classList.add('show');
    document.getElementById('selected-players').classList.add('show');
    updateSelectedPlayers(playerCount);

    listenForGameResult(currentMatchId);
}

function generateTournamentMatches(playerCount) {
    const players = Array.from({ length: playerCount }, (_, i) => i + 1);
    let matches = [];
    let matchId = 1;
    let winnerCounter = 1;
    let loserCounter = 1;

    // Generate matches based on player count
    if (playerCount === 4) {
        matches.push({ match: matchId++, player1: players[0], player2: players[1], winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: players[2], player2: players[3], winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: `${WINNER_PREFIX}${winnerCounter++}`, player2: `${WINNER_PREFIX}${winnerCounter++}`, winner: '', ties: 0 });
    } else if (playerCount === 5) {
        matches.push({ match: matchId++, player1: players[0], player2: players[1], winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: players[2], player2: players[3], winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: `${LOSER_PREFIX}${loserCounter++}`, player2: players[4], winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: `${WINNER_PREFIX}${winnerCounter++}`, player2: `${WINNER_PREFIX}${winnerCounter++}`, winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: `${LOSER_PREFIX}${loserCounter++}`, player2: `${WINNER_PREFIX}${winnerCounter++}`, winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: `${WINNER_PREFIX}${winnerCounter++}`, player2: `${WINNER_PREFIX}${winnerCounter++}`, winner: '', ties: 0 });
    } else if (playerCount === 6) {
        matches.push({ match: matchId++, player1: players[0], player2: players[1], winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: players[2], player2: players[3], winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: players[4], player2: players[5], winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: `${WINNER_PREFIX}${winnerCounter++}`, player2: `${WINNER_PREFIX}${winnerCounter++}`, winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: `${WINNER_PREFIX}${winnerCounter++}`, player2: `${LOSER_PREFIX}${loserCounter++}`, winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: `${WINNER_PREFIX}${winnerCounter++}`, player2: `${WINNER_PREFIX}${winnerCounter++}`, winner: '', ties: 0 });
    } else if (playerCount === 7) {
        matches.push({ match: matchId++, player1: players[0], player2: players[1], winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: players[2], player2: players[3], winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: players[4], player2: players[5], winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: `${WINNER_PREFIX}${winnerCounter++}`, player2: `${WINNER_PREFIX}${winnerCounter++}`, winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: `${LOSER_PREFIX}${loserCounter++}`, player2: players[6], winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: `${WINNER_PREFIX}${winnerCounter++}`, player2: `${WINNER_PREFIX}${winnerCounter++}`, winner: '', ties: 0 });
        matches.push({ match: matchId++, player1: `${WINNER_PREFIX}${winnerCounter++}`, player2: `${WINNER_PREFIX}${winnerCounter++}`, winner: '', ties: 0 });
    }

    return matches;
}

function displayMatches() {
    const matchList = document.getElementById('match-list');
    matchList.innerHTML = '';

    matches.forEach(match => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${match.match}</td>
            <td>
                <div class="player-box ${getPlayerClass(match.player1)}">${formatPlayer(match.player1)}</div>
                vs
                <div class="player-box ${getPlayerClass(match.player2)}">${formatPlayer(match.player2)}</div>
            </td>
            <td id="winner-${match.match}">${match.winner ? `<div class="player-box ${getPlayerClass(match.winner)}">${formatPlayer(match.winner)}</div>` : ''}</td>
        `;
        matchList.appendChild(row);
    });
}

function formatPlayer(player) {
    return player; // Return formatted string directly
}

function getPlayerClass(player) {
    if (typeof player === 'number') {
        return `player${player}`;
    }
    return player.startsWith(WINNER_PREFIX) ? 'winner' : 'loser';
}

function listenForGameResult(matchId) {
    if (isTournamentOver()) {
        tournamentEnded = true;
        disableCells();
        return;
    }

    // Proceed only if the tournament is not over
    if (!tournamentEnded) {
        resetGame();
        currentMatchId = matchId;
        document.querySelectorAll('.tic-tac-toe-cell').forEach(cell => {
            cell.replaceWith(cell.cloneNode(true)); // Remove existing listeners
        });
        document.querySelectorAll('.tic-tac-toe-cell').forEach(cell => {
            cell.addEventListener('click', event => handleCellClick(event, matchId));
        });
    }
}

function isTournamentOver() {
    // Check if every match has a winner or is a tie
    const allMatchesCompleted = matches.every(match => match.winner !== '' || match.winner === 'tie');
    
    // Verify if the last match is among the completed matches
    const finalMatch = matches[matches.length - 1];
    const finalMatchCompleted = finalMatch && (finalMatch.winner !== '' || finalMatch.winner === 'tie');

    // Tournament is over if all matches are completed and the final match is completed
    const tournamentOver = allMatchesCompleted && finalMatchCompleted;
    
    console.log("Is tournament over? ", tournamentOver);
    return tournamentOver;
}


function disableCells() {
    document.querySelectorAll('.tic-tac-toe-cell').forEach(cell => {
        cell.removeEventListener('click', handleCellClick); // Remove listeners if any
    });
    gameActive = false; // Ensure game is not active
}

// Define Audio objects with volume adjustments
const boxSound = new Audio('music/box1.mp3');
const xSound = new Audio('music/x1.mp3');
const oSound = new Audio('music/o1.mp3');

// Adjust the volume levels for each sound
boxSound.volume = 0.2; // Lower the background box sound volume
xSound.volume = 0.4; // Adjust X sound volume to make it softer
oSound.volume = 0.4; // Adjust O sound volume to make it softer

// Ensure boxSound can loop and play in the background
boxSound.loop = true;  // Allows continuous playback while the game box is shown
boxSound.preload = 'auto'; // Preload to avoid delay


function showGameBox() {
    const gameBox = document.getElementById('game-box');
    const spinWheelPopup = document.getElementById('spinWheelPopup');
    const spinBtn = document.getElementById('spinBtn');

    // Show the game box
    gameBox.style.display = 'block';

    // Hide the spin wheel popup
    spinWheelPopup.style.display = 'none';

    // Hide the spin button to ensure it is not visible when transitioning back to the game box
    spinBtn.style.display = 'none';

    // Play boxSound if not already playing
    if (boxSound.paused) {
        boxSound.play().catch(error => {
            console.error('Error playing box sound:', error);
        });
    }
}

function hideGameBox() {
    const gameBox = document.getElementById('game-box');
    const spinWheelPopup = document.getElementById('spinWheelPopup');
    const spinBtn = document.getElementById('spinBtn');

    // Hide game box
    gameBox.style.display = 'none';

    // Hide the spin wheel popup if it's currently visible
    if (spinWheelPopup.style.display === 'block') {
        spinWheelPopup.style.display = 'none';
    }

    // Ensure spin button is hidden
    spinBtn.style.display = 'none';

    // Stop the box sound if it's playing
    if (!boxSound.paused) {
        boxSound.pause();
        boxSound.currentTime = 0; // Reset to the start
    }
}






// Function to play the marker sound based on the marker
function playMarkerSound(marker) {
    const sound = marker === 'X' ? xSound : oSound;
    sound.currentTime = 0; // Restart the sound
    sound.play().catch(error => {
        console.error('Error playing marker sound:', error);
    });
}

// Function to handle cell clicks
function handleCellClick(event, matchId) {
    if (!gameActive || tournamentEnded) {
        console.log("Tournament has ended or game is not active. No further input allowed.");
        return;
    }

    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Update game state and cell content
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    // Play the marker sound (X or O)
    playMarkerSound(currentPlayer);

    // Ensure box.mp3 continues playing in the background
    if (boxSound.paused) {
        boxSound.play().catch(error => {
            console.error('Error continuing box sound:', error);
        });
    }

    // Check for a win or draw
    if (checkWin()) {
        gameActive = false;  // Set immediately to prevent further clicks
        setTimeout(() => {
            alert(`${currentPlayer} wins!`);
            const match = matches.find(m => m.match === matchId);
            const winner = currentPlayer === 'X' ? match.player1 : match.player2;
            updateWinner(matchId, winner);
            if (isFinalMatch(matchId)) {
                endTournament(); // Handle end of tournament
            }
        }, 100);
    } else if (gameState.every(cell => cell !== '')) {
        gameActive = false;  // Set immediately to prevent further clicks
        setTimeout(() => {
            alert(`It's a draw!`);
            handleTie(matchId);
            if (isFinalMatch(matchId)) {
                endTournament(); // Handle end of tournament
            }
        }, 100);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}


// Initialize button click sound
const buttonClickSound = new Audio('music/click.mp3');

// Function to play button click sound
function playButtonClickSound() {
    buttonClickSound.currentTime = 0; // Restart the sound
    buttonClickSound.play().catch(error => {
        console.error('Error playing button click sound:', error);
    });
}

// Add event listeners to all buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', playButtonClickSound);
});



let isFinalMatchFlag = false; // Update this flag as necessary

function isFinalMatch(matchId) {
    return isFinalMatchFlag;
}



function checkWin() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameState[a] === currentPlayer && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });
}

function resetGame() {
    gameState.fill('');
    document.querySelectorAll('.tic-tac-toe-cell').forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o'); // Clear previous styles
    });
    gameActive = true;
    currentPlayer = 'X'; // Reset to Player X
}





function handleTie(matchId) {
    const match = matches.find(m => m.match === matchId);
    match.ties++;

    if (match.ties < 1) {
        alert('No winner! Replay the match.');
        listenForGameResult(matchId);
    } else {
        // If it's the final match and ends in a tie, show the spin wheel to determine the winner
        if (isFinalMatch(matchId)) {
            hideGameBoxAndShowSpinWheel(matchId); // Show spin wheel for the final match
            setTimeout(() => {
                endTournament(); // Ensure the tournament ends after the final match is resolved
            }, 500); // Delay to ensure the spin wheel is shown before ending the tournament
        } else {
            hideGameBoxAndShowSpinWheel(matchId); // Hide game box and show spin wheel for non-final match
        }
    }
}

function hideGameBoxAndShowSpinWheel(matchId) {
    return new Promise((resolve) => {
        const gameBox = document.getElementById('game-box');
        const spinWheelPopup = document.getElementById('spinWheelPopup');
        const playAgainButton = document.getElementById('playAgainBtn');
        const lightsContainer = document.getElementById('lights-container');
        const spinBtn = document.getElementById('spinBtn');

        if (!playAgainButton) {
            console.error('Play Again button not found');
            resolve(); // Resolve the promise to continue
            return;
        }

        // Hide the game box
        gameBox.style.display = 'none';

        // Show the spin wheel popup
        spinWheelPopup.style.display = 'flex';
        spinWheelPopup.classList.add('active');

        // Show the spin button when the spin wheel popup is visible
        if (spinBtn) {
            spinBtn.style.display = 'block';
            console.log('Spin button displayed');
        }

        // Show and start rotating lights
        if (lightsContainer) {
            lightsContainer.style.display = 'block';
            lightsContainer.classList.add('rotate-lights');
        }

        // Fetch match details
        const match = matches.find(m => m.match === matchId);
        if (!match) {
            console.error('Match not found:', matchId);
            resolve(); // Resolve the promise to continue
            return;
        }

        const player1 = match.player1;
        const player2 = match.player2;

        // Define segments for innercircle2
        const segments = [
            { start: 90, end: 134 },
            { start: 135, end: 179 },
            { start: 180, end: 224 },
            { start: 225, end: 269 },
            { start: 270, end: 314 },
            { start: 315, end: 359 },
            { start: 0, end: 44 },
            { start: 45, end: 89 }
        ];

        const players = [player1, player2];

        // Clear existing segments for innercircle2
        const innerCircle2 = document.getElementById('innercircle2');
        innerCircle2.innerHTML = '';

        // Function to create segments and lines
        function createSegmentsAndLines(container, segments, players) {
            segments.forEach((segment, i) => {
                const segElement = document.createElement('div');
                segElement.className = 'segment';
                segElement.style.transform = `rotate(${segment.start}deg)`;
                container.appendChild(segElement);

                const segmentText = document.createElement('div');
                segmentText.className = 'segment-text';
                segmentText.style.transform = `rotate(-${segment.start}deg)`;
                segmentText.textContent = players[i % players.length];
                segElement.appendChild(segmentText);

                const lineElement = document.createElement('div');
                lineElement.className = 'division-line';
                lineElement.style.transform = `rotate(${segment.end}deg)`;
                container.appendChild(lineElement);
            });

            // Add final line to complete the circle
            const finalLineElement = document.createElement('div');
            finalLineElement.className = 'division-line';
            finalLineElement.style.transform = `rotate(${segments[0].start}deg)`;
            container.appendChild(finalLineElement);
        }

        createSegmentsAndLines(innerCircle2, segments, players);

        // Set up spin button click handler
        if (spinBtn) {
            spinBtn.onclick = () => {
                spinWheel(matchId, players, segments.length).then((winner) => {
                    showWinnerNotification(winner);
                    updateScheduleBoxWithWinner(matchId, winner);

                    // Hide the spin wheel popup and stop the lights rotation
                    spinWheelPopup.style.display = 'none';
                    spinWheelPopup.classList.remove('active');
                    if (lightsContainer) {
                        lightsContainer.style.display = 'none';
                        lightsContainer.classList.remove('rotate-lights');
                    }

                    // Hide the 'Play Again' button after spin wheel completes
                    playAgainButton.style.display = 'none';

                    // Hide the spin button after spin wheel completes
                    if (spinBtn) {
                        spinBtn.style.display = 'none';
                        console.log('Spin button hidden');
                    }

                    resolve(); // Resolve the promise to proceed
                }).catch((error) => {
                    console.error('Error during spin wheel:', error);

                    // Hide the spin wheel popup and stop the lights rotation
                    spinWheelPopup.style.display = 'none';
                    spinWheelPopup.classList.remove('active');
                    if (lightsContainer) {
                        lightsContainer.style.display = 'none';
                        lightsContainer.classList.remove('rotate-lights');
                    }

                    // Hide the 'Play Again' button after spin wheel completes
                    playAgainButton.style.display = 'none';

                    // Hide the spin button after spin wheel completes
                    if (spinBtn) {
                        spinBtn.style.display = 'none';
                        console.log('Spin button hidden due to error');
                    }

                    resolve(); // Resolve the promise even if there's an error
                });
            };
        } else {
            console.error('Spin button not found');
            resolve(); // Resolve the promise even if there's an error
        }
    });
}



// Show the end of tournament message
function showEndTournamentMessage() {
    const messageElement = document.getElementById('endTournamentMessage');
    messageElement.textContent = 'The tournament is over! Please click on Schedule to start a new tournament.';
    messageElement.style.display = 'block'; // Show the end of tournament message
}


function showWinnerNotification(winner) {
    // Implement logic to show the winner notification here
    // For example, display a message like "Player X is the winner!"
    alert(`Player ${winner} is the winner!`);
}


function spinWheel(matchId, players, numSegments) {
    if (tournamentEnded) {
        return; // Prevent further spins if the tournament has ended
    }
    

    const spinDuration = 5000; // Duration of the spin
    const indicator = document.getElementById('indicator'); // Get the indicator element
    const wheel = document.getElementById('wheel'); // Get the wheel element
    const innerCircle1 = document.getElementById('innercircle1');
    const innerCircle2 = document.getElementById('innercircle2');
    const innerCircle3 = document.getElementById('innercircle3');
    let currentDegree = 0; // Variable to store the current rotation degree

    // Ensure the game box is hidden and spin wheel is shown
    document.getElementById('game-box').style.display = 'none';
    document.getElementById('spinWheelPopup').style.display = 'block';

    // Hide the spin button when spin wheel popup is shown
    const spinBtn = document.getElementById('spinBtn');
    spinBtn.style.pointerEvents = 'none';
    spinBtn.style.display = 'none'; // Hide the spin button

    // Set up the spinning animation for the main wheel
    const desiredRPM = 0.75; // Rounds per second
    const spinTimeInSeconds = 5; // Duration of the spin in seconds
    const totalDegrees = desiredRPM * spinTimeInSeconds * 360;

    // Random spin degrees with base total degrees
    const degree = Math.floor(Math.random() * 360) + totalDegrees;
    currentDegree += degree; // Calculate the new cumulative degree

    // Set up the spinning animation for the main wheel
    wheel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    wheel.style.transform = `rotate(${currentDegree}deg)`; // Rotate wheel clockwise

    // Set up the different rotations for each inner circle
    innerCircle1.style.transition = `transform ${spinDuration}ms ease-out`;
    innerCircle1.style.transform = `translate(-50%, -50%) rotate(${currentDegree * 2}deg)`; // Moderate clockwise

    innerCircle2.style.transition = `transform ${spinDuration}ms ease-out`;
    innerCircle2.style.transform = `translate(-50%, -50%) rotate(${-currentDegree}deg)`; // Anticlockwise

    innerCircle3.style.transition = `transform ${spinDuration}ms ease-out`;
    innerCircle3.style.transform = `translate(-50%, -50%) rotate(${currentDegree * 2}deg)`; // Moderate clockwise

    indicator.style.transition = `transform ${spinDuration * 2}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    indicator.style.transform = `translate(-50%, -50%) rotate(${currentDegree}deg)`; // Slow clockwise for indicator

    setTimeout(() => {
        // Calculate the final wheel rotation relative to 360 degrees
        const wheelDegree = currentDegree % 360;

        // Determine the final stopping position of the wheel
        const segmentDegree = 360 / numSegments;
        const finalDegree = Math.floor((wheelDegree + segmentDegree / 2) / segmentDegree) * segmentDegree;

        // Apply the final rotation for the indicator
        indicator.style.transition = `transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        indicator.style.transform = `translate(-50%, -50%) rotate(${finalDegree}deg)`;

        setTimeout(() => {
            // Calculate the winning segment
            const winningSegmentIndex = Math.floor(finalDegree / segmentDegree) % numSegments;
            const winnerId = players[winningSegmentIndex % players.length];

            // Debugging logs
            console.log('Wheel Degree:', wheelDegree);
            console.log('Final Indicator Degree:', finalDegree);
            console.log('Winning Segment Index:', winningSegmentIndex);
            console.log('Winner ID:', winnerId);

            // Show the winner notification
            document.getElementById('winnerText').innerText = `Winner is Player ${winnerId}`;
            document.getElementById('winnerNotification').style.display = 'block';

            setTimeout(() => {
                // Hide the winner notification and update match result
                document.getElementById('winnerNotification').style.display = 'none';
                updateMatchResult(matchId, winnerId);

                // Check if this was the final match
                if (currentMatchId >= matches.length) {
                    tournamentEnded = true; // Set the flag to indicate the tournament has ended

                    // Ensure the playAgainBtn is displayed
                    const playAgainBtn = document.getElementById('playAgainBtn') || document.createElement('button');
                    playAgainBtn.id = 'playAgainBtn';
                    playAgainBtn.innerText = 'Play Again';
                    playAgainBtn.style.display = 'block';
                    playAgainBtn.onclick = () => {
                        location.reload(); // Refresh the page to reset everything
                    };
                    document.getElementById('spinWheelPopup').appendChild(playAgainBtn);

                    // Show tournament winner popup
                    document.getElementById('winnerText').innerText = `Tournament Winner is Player ${winnerId}`;
                    document.getElementById('winnerNotification').style.display = 'block';
                    setTimeout(() => {
                        document.getElementById('winnerNotification').style.display = 'none';
                    }, 5000);

                    disableGameBoxInput(); // Disable input in the game box
                } else {
                    // Show the game box again before resetting the game
                    document.getElementById('game-box').style.display = 'block';
                    document.getElementById('spinWheelPopup').style.display = 'none';

                    // Reset game and check if there are more matches
                    resetGame();
                    currentMatchId++;

                    if (currentMatchId <= matches.length) {
                        listenForGameResult(currentMatchId);
                    } else {
                        showTournamentResults();
                    }
                }

                // Re-enable the spin button if the tournament is not ended
                if (!tournamentEnded) {
                    spinBtn.style.pointerEvents = 'auto';
                    spinBtn.style.display = 'block'; // Show the spin button
                }

                // Reset wheel and indicator rotation
                wheel.style.transition = 'none';
                wheel.style.transform = 'rotate(0deg)';
                innerCircle1.style.transition = 'none';
                innerCircle1.style.transform = 'translate(-50%, -50%) rotate(0deg)';
                innerCircle2.style.transition = 'none';
                innerCircle2.style.transform = 'translate(-50%, -50%) rotate(0deg)';
                innerCircle3.style.transition = 'none';
                innerCircle3.style.transform = 'translate(-50%, -50%) rotate(0deg)';
                indicator.style.transition = 'none';
                indicator.style.transform = 'translate(-50%, -50%) rotate(0deg)';

                // Reset currentDegree for the next spin
                currentDegree = 0;
            }, 5000); // Show notification for 5 seconds
        }, 3000); // Wait for 3 seconds after the indicator stops
    }, spinDuration);
}




function resetWheelRotation(wheel, innerCircle1, innerCircle2, innerCircle3, indicator) {
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    innerCircle1.style.transition = 'none';
    innerCircle1.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    innerCircle2.style.transition = 'none';
    innerCircle2.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    innerCircle3.style.transition = 'none';
    innerCircle3.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    indicator.style.transition = 'none';
    indicator.style.transform = 'translate(-50%, -50%) rotate(0deg)';
}

// Ensure the game box input is disabled
function disableGameBoxInput() {
    const gameBoxInputs = document.querySelectorAll('#game-box input, #game-box button');
    gameBoxInputs.forEach(input => {
        input.disabled = true;
    });
}

function endTournament() {
    const gameBox = document.getElementById('game-box');
    const playAgainBtn = document.getElementById('playAgainBtn');

    // Disable all input fields to prevent further input
    disableGameBoxInput();

    // Display a message indicating the tournament is over
    alert('The tournament is over! Please click on Schedule to start a new tournament.');

    // Ensure the playAgainBtn is displayed
    playAgainBtn.style.display = 'block';

    // Hide the spin button as the tournament has ended
    const spinBtn = document.getElementById('spinBtn');
    spinBtn.style.display = 'none'; // Hide the spin button
}

function disableInputs() {
    // Disable all interactive elements in the game box
    const inputs = document.querySelectorAll('#game-box input, #game-box button');
    inputs.forEach(input => {
        input.disabled = true;
    });
}


// Add event listener for the "Play Again" button
document.getElementById('playAgainBtn').addEventListener('click', () => {
    // Reset the game and reload the page
    location.reload(); // This will reset all game data and start fresh
});

// Ensure no conflicting event listeners
document.getElementById('schedule-button').addEventListener('click', scheduleTournament);
document.getElementById('tournament-button').addEventListener('click', () => {
    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('schedule-page').classList.remove('hidden');
});

document.querySelectorAll('.spinBtn').forEach(button => {
    button.addEventListener('click', spinWheel);
});












function updateSelectedPlayers(playerCount) {
    const playerBox = document.getElementById('selected-players');
    playerBox.innerHTML = `Players (${playerCount}): `;
    for (let i = 1; i <= playerCount; i++) {
        playerBox.innerHTML += `<div class="player-box player${i}">${i}</div>`;
    }
}

function highlightWinnerInPlayerBox(winner) {
    const playerBox = document.querySelector(`.player-box[data-player="Player ${winner}"]`);
    
    // Remove highlight from any previously highlighted players
    document.querySelectorAll('.player-box').forEach(player => {
        player.classList.remove('winner-highlight');
    });

    // Highlight the current winner
    if (playerBox) {
        playerBox.classList.add('winner-highlight');
    }
}



function updateWinner(matchId, winner) {
    const winnerCell = document.getElementById(`winner-${matchId}`);
    if (winner === 'tie') {
        winnerCell.innerHTML = 'Tie';
    } else {
        winnerCell.innerHTML = `<div class="player-box ${getPlayerClass(winner)}">${formatPlayer(winner)}</div>`;

        // Highlight the winner and mark the loser
        highlightWinnerInPlayerBox(winner);
        markLoserInPlayerBox(winner, matchId);
    }

    // Check if this is the last match
    if (isFinalMatch(matchId)) {
        if (winner === 'tie') {
            hideGameBoxAndShowSpinWheel(matchId);
        } else {
            endTournament();
        }
    } else {
        const nextMatchId = matchId + 1;
        if (matches.some(match => match.match === nextMatchId)) {
            listenForGameResult(nextMatchId);
        } else {
            console.error(`Match ID ${nextMatchId} does not exist.`);
            endTournament();
        }
    }
}









function updateMatchResult(matchId, winner) {
    const match = matches.find(m => m.match === matchId);
    if (!match) {
        console.error('Match not found for ID:', matchId);
        return;
    }

    // Update match result
    match.winner = winner;
    match.ties = 0; // Reset ties for the next match

    // Debugging: Log match before updating
    console.log('Updating match result:', match);
    console.log('Matches before display update:', matches);

    // Update only the relevant match row in the schedule box
    const matchRow = document.querySelector(`#match-list tr:nth-child(${matchId})`);
    if (matchRow) {
        const winnerCell = matchRow.querySelector(`#winner-${matchId}`);
        if (winnerCell) {
            winnerCell.innerHTML = match.winner ? `<div class="player-box ${getPlayerClass(match.winner)}">${formatPlayer(match.winner)}</div>` : '';
        }
    }

    // Highlight the winner and mark the loser in the player box
    highlightWinnerInPlayerBox(winner);
    markLoserInPlayerBox(winner, matchId);

    // Debugging: Log matches after display update
    console.log('Matches after display update:', matches);

    // Proceed to next match or show tournament results
    if (currentMatchId <= matches.length) {
        console.log('Listening for next game result:', currentMatchId);
        listenForGameResult(currentMatchId);
    } else {
        console.log('Showing tournament results');
        showTournamentResults();
    }
}

// Function to highlight the winner in the selected players box
function highlightWinnerInPlayerBox(winner) {
    // Remove any existing highlights first
    document.querySelectorAll('.player-box').forEach(player => {
        player.classList.remove('winner-highlight', 'losing'); // Ensure to remove previous animations
    });

    // Find and highlight the winning player
    const winnerBox = document.querySelector(`.player-box.player${winner}`);
    if (winnerBox) {
        winnerBox.classList.add('winner-highlight'); // Add the winning animation class

        // Remove the winner-highlight class after 3 seconds
        setTimeout(() => {
            winnerBox.classList.remove('winner-highlight');
        }, 3000); // 3 seconds
    }
}



// Function to mark the loser in Selected Players with inline styles
function markLoserInPlayerBox(winner, matchId) {
    const match = matches.find(m => m.match === matchId);
    const loser = match.player1 === winner ? match.player2 : match.player1;

    const loserBox = document.querySelector(`.player-box.player${loser}`);
    if (loserBox) {
        // Add a red '❌' to the loser's box
        loserBox.innerHTML += ' ❌';
        
        // Apply inline styles to indicate a loser
        loserBox.style.backgroundColor = '#ffe0e0'; // Light red background
        loserBox.style.border = '2px solid #dc3545'; // Red border
        loserBox.style.boxShadow = '0 0 10px rgba(220, 53, 69, 0.7)'; // Red shadow
        loserBox.style.transition = 'all 0.3s ease-in-out'; // Smooth transition

        // Remove the styles after 3 seconds
        setTimeout(() => {
            loserBox.style.backgroundColor = ''; // Reset background color
            loserBox.style.border = ''; // Reset border
            loserBox.style.boxShadow = ''; // Reset shadow
        }, 3000);
    }
}

// Function to highlight the winner in Selected Players with inline styles
function highlightWinnerInPlayerBox(winner) {
    // Clear any previous winner or loser styles
    document.querySelectorAll('.player-box').forEach(player => {
        player.style.backgroundColor = ''; // Reset background
        player.style.border = ''; // Reset border
        player.style.boxShadow = ''; // Reset shadow
    });

    const winnerBox = document.querySelector(`.player-box.player${winner}`);
    if (winnerBox) {
        // Apply green light shadow effect for the winner
        winnerBox.style.backgroundColor = '#e0ffe0'; // Light green background
        winnerBox.style.border = '2px solid #28a745'; // Bold green border
        winnerBox.style.boxShadow = '0 0 10px rgba(40, 167, 69, 0.7)'; // Green shadow
        winnerBox.style.transition = 'all 0.3s ease-in-out'; // Smooth transition

        // Remove the styles after 3 seconds to reset the appearance
        setTimeout(() => {
            winnerBox.style.backgroundColor = ''; // Reset background color
            winnerBox.style.border = ''; // Reset border
            winnerBox.style.boxShadow = ''; // Reset shadow
        }, 3000);
    }
}



function triggerWinnerPopup(playerBoxElement, columnNumber) {
    // Remove any previous winner-popup class
    playerBoxElement.classList.remove('winner-popup', 'column-1', 'column-2', 'column-3');

    // Add the winner-popup and column class based on the winner's column
    playerBoxElement.classList.add('winner-popup', `column-${columnNumber}`);

    // Remove the popup after 5 seconds
    setTimeout(() => {
        playerBoxElement.classList.remove('winner-popup', `column-${columnNumber}`);
    }, 5000);
}

// Example usage:
// Assuming `playerBox` is the element and `winnerColumn` is the column number (1, 2, or 3)
triggerWinnerPopup(playerBox, winnerColumn);






function showTournamentResults() {
    const tournamentWinner = determineTournamentWinner();
    alert(`Tournament Winner: Player ${tournamentWinner}`);
}

function determineTournamentWinner() {
    const winCounts = {};
    matches.forEach(match => {
        if (match.winner) {
            const winner = match.winner.replace(WINNER_PREFIX, '');
            if (!winCounts[winner]) {
                winCounts[winner] = 0;
            }
            winCounts[winner]++;
        }
    });
    const sortedWinners = Object.keys(winCounts).sort((a, b) => winCounts[b] - winCounts[a]);
    return sortedWinners[0];
}

function goBack() {
    var button = document.getElementById('back-to-main-menu');
    button.classList.add('animate-shift');
    
    // Remove the animation class after the animation ends to allow future animations
    button.addEventListener('animationend', function() {
        window.location.href = 'main.html';
    }, { once: true });
}