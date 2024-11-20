window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const winner = urlParams.get('winner');
    
    // Create a new div element to display the winner
    const winnerDisplay = document.createElement('div');
    winnerDisplay.id = 'winnerDisplay';
    winnerDisplay.textContent = `The winner is: ${winner}`;

    // Append the new div to the body or a specific container
    document.body.appendChild(winnerDisplay);
};

