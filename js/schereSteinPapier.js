function computerPlay() { //Zufallsfunktion zur Auswahl des NPC
    const options = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * options.length);
    console.log(options[randomIndex]);
    return options[randomIndex];
}

function playRound(playerSelection, computerSelection) { // Auswertung der Auswahlen und Rückgabe von passendem Text
    
    if (
        (playerSelection === 'rock' && computerSelection === 'scissors') ||
        (playerSelection === 'paper' && computerSelection === 'rock') ||
        (playerSelection === 'scissors' && computerSelection === 'paper')
    ) {
        return 'You win! ' + playerSelection + ' beats ' + computerSelection;
    } else if (
        (playerSelection === 'rock' && computerSelection === 'paper') ||
        (playerSelection === 'paper' && computerSelection === 'scissors') ||
        (playerSelection === 'scissors' && computerSelection === 'rock')
    ) {
        return 'You lose! ' + computerSelection + ' beats ' + playerSelection;
    } else {
        return 'It\'s a tie!';
    }
}
function show(){
    document.getElementById("selectionArea").style.display="block";
}

function game(selection) { // wird durch den onchange im HTML aufgerufen. Parameter wird über this-Operator mit ausgewählten value dort festgelegt
    
    const playerSelection = selection;
    const computerSelection = computerPlay(); // siehe oben
    
    console.log(playRound(playerSelection, computerSelection)); //Ausgabe des Ergebnisses auf der Konsole, das durch die Funktion playRound produziert wurde.
        
}
