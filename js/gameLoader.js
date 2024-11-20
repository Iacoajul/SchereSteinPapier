function playGame() {
    const pAmount = document.getElementById('players').value;
    const wAmount = document.getElementById('WinCon').value;
    window.location.href = `game.html?pAmount=${pAmount}&wAmount=${wAmount}`;
}

const pAmount = urlParams.get(pAmount);  //StringValue (botgame, duel, threesome, none)
const wAmount = urlParams.get(wAmount); //int value 1-15