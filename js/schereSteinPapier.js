const pAmount = urlParams.get(pAmount);  //StringValue (botgame, duel, threesome, none)
const wAmount = urlParams.get(wAmount); //int value 1-15

function computerPlay() { //Zufallsfunktion zur Auswahl des NPC
    const options = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * options.length);
    console.log(options[randomIndex]);
    return options[randomIndex];
}

function playRound(player1Selection, player2Selection) { // Auswertung der Auswahlen und Rückgabe von passendem Text
    
    if (
        (player1Selection === 'rock' && player2Selection === 'scissors') ||
        (player1Selection === 'paper' && player2Selection === 'rock') ||
        (player1Selection === 'scissors' && player2Selection === 'paper')
    ) {
        return 'You win! ' + player1Selection + ' beats ' + player2Selection;
    } else if (
        (player1Selection === 'rock' && player2Selection === 'paper') ||
        (player1Selection === 'paper' && player2Selection === 'scissors') ||
        (player1Selection === 'scissors' && player2Selection === 'rock')
    ) {
        return 'You lose! ' + player2Selection + ' beats ' + player1Selection;
    } else {
        return 'It\'s a tie!';
    }
}
function show(){
    document.getElementById("selectionArea").style.display="block";
}

function game(selection) { // wird durch den onchange im HTML aufgerufen. Parameter wird über this-Operator mit ausgewählten value dort festgelegt
    
    const player1Selection = selection;
    const player2Selection = computerPlay(); // siehe oben
    
    console.log(playRound(player1Selection, player2Selection)); //Ausgabe des Ergebnisses auf der Konsole, das durch die Funktion playRound produziert wurde.
        
}
