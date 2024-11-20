// Game State Management
const GameState = {
    MODES: {
        BOTGAME: { players: 1, bots: 1 },
        DUEL: { players: 2, bots: 0 },
        THREESOME: { players: 2, bots: 1 },
        NONE: { players: 0, bots: 2 }
    },

    state: {
        activeMode: null,
        participants: [],
        currentTurn: 0,
        currentRound: 1,
        selections: {}, //hopefully deadweight
        scores: {},
        winsNeeded: 0
    },

    initialize(mode, winsNeeded) {
        this.state.activeMode = mode;
        this.state.winsNeeded = winsNeeded;
        this.currentRound = 1;
        this.setupParticipants(mode);
        this.resetGame();
    },

    setupParticipants(mode) {
        const config = this.MODES[mode.toUpperCase()] || this.MODES.NONE;
        this.state.participants = [];

        // Add human and bot participants
        for (let i = 0; i < config.players; i++) {
            this.state.participants.push({ id: `player${i + 1}`, type: 'human', name: `Player ${i + 1}`, selection: null  });
        }
        for (let i = 0; i < config.bots; i++) {
            this.state.participants.push({ id: `bot${i + 1}`, type: 'bot', name: `Bot ${i + 1}`, selection: null  });
        }

        // Initialize scores
        this.state.participants.forEach(p => this.state.scores[p.id] = 0);
    },

    resetGame() {
        this.state.currentTurn = 0;
        this.state.participants.forEach(p => p.selection = null);
    },

    getCurrentParticipant() {
        return this.state.participants[this.state.currentTurn % this.state.participants.length];
    },

    showOnlyCurrentParticipant() {
        this.state.participants
            .filter(p => p.type === 'human') 
            .forEach(p => {
                if (p.id === this.getCurrentParticipant().id) {
                    UIManager.displaySelectionArea(p.id);
                } else {
                    UIManager.hideSelectionArea(p.id);
                }
            });
    }
};

// UI Management
const UIManager = {
    createGameUI() {
        const container = document.getElementById('gameContainer');
        container.innerHTML = ''; // Clear existing content

        // Create selection areas for human participants only
        GameState.state.participants
            .filter(p => p.type === 'human')  // Only create selection areas for human participants
            .forEach(p => {
                container.appendChild(this.createSelectionArea(p));
            });

        // Create result display if it doesn't already exist
        if (!document.getElementById('resultDisplay')) {
            const resultDisplay = document.createElement('div');
            resultDisplay.id = 'resultDisplay';
            container.appendChild(resultDisplay);
        }

        // Add the scoreboard to the container
        container.appendChild(this.createScoreBoard());

        // Add the round count to the container
    container.appendChild(this.createRoundCount());

        GameState.showOnlyCurrentParticipant();
    },

    createSelectionArea(participant) {
        const section = document.createElement('section');
        section.id = `selectionArea_${participant.id}`;
        section.className = 'selectionArea';
        section.innerHTML = `
            <label for="choice_${participant.id}">${participant.name}'s choice:</label>
            <select id="choice_${participant.id}" onchange="GameController.handleSelection('${participant.id}', this.value)">
                <option value="nothing">scissors? rock? paper?</option>
                <option value="scissors">Scissors</option>
                <option value="rock">Rock</option>
                <option value="paper">Paper</option>
            </select>
        `;
        return section;
    },

    hideSelectionArea(participantId) {
        document.getElementById(`selectionArea_${participantId}`).style.display = 'none';
    },

    displaySelectionArea(participantId) {
        const element = document.getElementById(`selectionArea_${participantId}`);
        if (element) {
            element.style.display = 'block';
        } else {
            console.error(`Element with ID selectionArea_${participantId} not found.`);
        }
    },

    createRoundCount() {
        const roundCount = document.createElement('div');
        roundCount.id = 'roundCount';
        roundCount.innerHTML = `Round: <span id="currentRound">${GameState.state.currentRound }</span>`;
        return roundCount;
    },

    createScoreBoard() {
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'scoreBoard';

        GameState.state.participants.forEach(p => {
            scoreBoard.innerHTML += `<div>${p.name}: <span id="score_${p.id}">0</span></div>`;
        });

    

        return scoreBoard;
    },

    updateScores() {
        Object.entries(GameState.state.scores).forEach(([id, score]) => {
            document.getElementById(`score_${id}`).textContent = score;
        });
    },

    updateRoundCount() {
        document.getElementById('currentRound').textContent = GameState.state.currentRound;
    }
};

// Game Logic
const GameController = {
    initialize(mode, wins) {
        GameState.initialize(mode, wins);
        UIManager.createGameUI();
    },

    handleSelection(participantId, choice) {
        console.log(`handleSelection called for ${participantId} with choice ${choice}`);

        if (choice === 'nothing') return;

        const currentParticipant = GameState.getCurrentParticipant();
        if (currentParticipant.id !== participantId) {
            alert("It's not your turn!");
            return;
        }

        // Update the selection for the participant
        const participant = GameState.state.participants.find(p => p.id === participantId);
        participant.selection = choice;

        // Check if all human participants have made a selection
        const allSelected = GameState.state.participants
            .filter(p => p.type === 'human')
            .every(p => p.selection !== null);


        if (allSelected) {
            this.evaluateRound();
        } else {
            this.advanceTurn();
        }
    },

    async evaluateRound() {
        const participants = GameState.state.participants;

        
        // Let bots make their selections
        participants.forEach(p => {
            if (p.type === 'bot') {
                p.selection = computerPlay();
            }
        });

        setTimeout(() => {
        // Compare selections and update scores
        participants.forEach(p1 => {
            participants.forEach(p2 => {
                if (p1.id !== p2.id) {
                    const result = playRound(p1.selection, p2.selection);
                    if (result === 'win') {
                        GameState.state.scores[p1.id]++;
                    }
                }
            });
        });

        console.log('Scores:', GameState.state.scores);
        // Display results
        this.displayResults();

        // Update the scoreboard
        GameState.state.currentRound++;
        UIManager.updateScores();
        UIManager.updateRoundCount();

        // Check for a winner
        this.checkWinCondition();

        // Reset selections for the next round
        GameState.resetGame();
        GameState.showOnlyCurrentParticipant();
    },1500);
    },

    displayResults() {
        const resultDisplay = document.getElementById('resultDisplay');
        const participants = GameState.state.participants;

        console.log('Displaying results:', participants);
        let resultText = 'Round Results:\n';
        participants.forEach(p => {
            resultText += `${p.name} chose ${p.selection}\n`;
        });

        resultDisplay.textContent = resultText;
    },

    checkWinCondition() {
        const participants = GameState.state.participants;
        const winsNeeded = GameState.state.winsNeeded;

        participants.forEach(p => {
            if (GameState.state.scores[p.id] >= winsNeeded) {
                alert(`${p.name} wins the game!`);
                this.endGame(p.name);
            }
        });
    },

    endGame(winner) {
        // Logic to end the game, e.g., reset the game state or navigate to a different page
        window.location.href = `win.html?winner=${winner}`;
        
        GameState.resetGame();
        UIManager.createGameUI();
        GameState.state.currentRound = 1;
    },


    advanceTurn() {
        GameState.state.currentTurn++;
        GameState.showOnlyCurrentParticipant();
    }
};

// Helper Functions
function computerPlay() {
    const options = ['rock', 'paper', 'scissors'];
    return options[Math.floor(Math.random() * options.length)];
}

function playRound(choice1, choice2) {
    if (choice1 === choice2) return 'tie';0
    return (
        (choice1 === 'rock' && choice2 === 'scissors') ||
        (choice1 === 'paper' && choice2 === 'rock') ||
        (choice1 === 'scissors' && choice2 === 'paper')
    ) ? 'win' : 'lose';
}


window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('pAmount');
    const winsNeeded = parseInt(urlParams.get('wAmount'));
    GameController.initialize(mode, winsNeeded);
});



/*tode:
-   winning page
-   rundenzähler
*/