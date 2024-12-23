// script.js

const gridBoard = document.getElementById('grid-board');
const colorPicker = document.getElementById('color-picker');
let selectedColor = null;
let coloredSquares = {};  // Object to track the positions of colored squares
let blackSquares = {};    // Object to track the positions of black squares

// Function to generate a unique ID (4 letters + 4 numbers)
function generateUniqueId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    // Generate 4 random letters
    let randomLetters = '';
    for (let i = 0; i < 4; i++) {
        randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // Generate 4 random numbers
    let randomNumbers = '';
    for (let i = 0; i < 4; i++) {
        randomNumbers += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return randomLetters + randomNumbers;
}

// Set up the color picker
colorPicker.addEventListener('click', (e) => {
    if (e.target.classList.contains('color')) {
        selectedColor = e.target.id;
    }
});

// Number of rows and columns based on square size
const rows = 108;
const cols = 192;

for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= cols; col++) {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        square.id = `${row}_${col}`; // Assign unique grid ID
        square.addEventListener('click', () => changeColor(square));

        // Tooltip container
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.style.display = 'none';
        square.appendChild(tooltip);

        square.addEventListener('mouseover', () => showTooltip(square));
        square.addEventListener('mouseout', () => hideTooltip(square));

        gridBoard.appendChild(square);
    }
}

// Function to change the color of a square
function changeColor(square) {
    const squareId = square.id;

    // Prevent changing the color if the square is already colored (black or colored square)
    if (coloredSquares[squareId] || blackSquares[squareId]) {
        return; // Stop if the square is already colored
    }

    if (selectedColor) {
        // Check if the square is being colored black
        if (selectedColor === 'black') {
            // Don't assign a unique ID to black squares, just track them
            blackSquares[squareId] = {
                color: selectedColor
            };
            square.style.backgroundColor = selectedColor;
        } else {
            // Assign a unique ID if the square is being colored for the first time
            const uniqueId = generateUniqueId();
            coloredSquares[squareId] = {
                color: selectedColor,
                uniqueId: uniqueId
            };
            console.log(`Square ${squareId} assigned unique ID: ${uniqueId}`);
            square.style.backgroundColor = selectedColor;
        }
    }
}

// Function to show tooltip when hovering over a colored square
function showTooltip(square) {
    const squareId = square.id;
    const tooltip = square.querySelector('.tooltip');

    // Show the tooltip only for colored squares or black squares
    if (coloredSquares[squareId]) {
        const { uniqueId, color } = coloredSquares[squareId];
        tooltip.innerHTML = `ID: ${uniqueId}<br>Color: ${color}`;
        tooltip.style.display = 'block';  // Show the tooltip
    } else if (blackSquares[squareId]) {
        const { color } = blackSquares[squareId];
        tooltip.innerHTML = `Color: ${color}`;
        tooltip.style.display = 'block';  // Show the tooltip
    }
}

// Function to hide tooltip when not hovering over a colored square
function hideTooltip(square) {
    const tooltip = square.querySelector('.tooltip');
    tooltip.style.display = 'none';  // Hide the tooltip
}

// Function to move the colored squares one tile at a time
function moveSquares() {
    const newPositions = {};  // Temp object to check for overlap

    // Loop through all colored squares
    for (const squareId in coloredSquares) {
        const { color, uniqueId } = coloredSquares[squareId];
        const oldSquare = document.getElementById(squareId);
        const [oldRow, oldCol] = squareId.split('_').map(Number);

        let newRow, newCol;
        let newSquareId, isOccupied = true;

        // Try to find a valid neighboring position that is unoccupied
        while (isOccupied) {
            // Pick a random direction (up, down, left, right)
            const direction = Math.floor(Math.random() * 4);
            if (direction === 0 && oldRow > 1) newRow = oldRow - 1, newCol = oldCol; // Up
            if (direction === 1 && oldRow < rows) newRow = oldRow + 1, newCol = oldCol; // Down
            if (direction === 2 && oldCol > 1) newRow = oldRow, newCol = oldCol - 1; // Left
            if (direction === 3 && oldCol < cols) newRow = oldRow, newCol = oldCol + 1; // Right

            newSquareId = `${newRow}_${newCol}`;

            // Check if the new position is already occupied (except black squares)
            if (!newPositions[newSquareId] && !coloredSquares[newSquareId] && !blackSquares[newSquareId]) {
                isOccupied = false;  // Found an empty spot
                newPositions[newSquareId] = true;  // Mark as occupied
            }
        }

        // Move the colored square to the new position
        const newSquare = document.getElementById(newSquareId);
        newSquare.style.backgroundColor = color;  // Keep the same color
        coloredSquares[newSquareId] = { color, uniqueId };  // Update the position and keep unique ID

        // Reset the old square's color
        oldSquare.style.backgroundColor = '#555';  // Reset to default color
        delete coloredSquares[squareId];  // Remove the old position from the tracker
    }
}

// Function to move squares periodically every 2 seconds
setInterval(moveSquares, 2000);
