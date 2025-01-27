/**
File Name: script.js
Original Authors: Drew Fink, Zach Sambol, Andrew Brown, Raj Nara
Modified By: Natasha Shirley, Chen Lu, Andrew Loaiza, Jui Nagarkar, and Regan Janssen
Description: JavaScript program for Battleship Game consisting of 2 player mode and 3 different levels of AI opponents
Date: Oct. 10, 2021
*/

const col = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var curPlyr = 1;
var amntShips = 0;
let p1Grid;
let p1Guess;
let p2Grid;
let p2Guess;
let AIgame;
let choice;
let onAi;
let easyMode;
let mediumMode;
let hardMode;
let gameEnded = false;

// medium case
var isHit = false;
var newShip;
var randomR;
var randomC;
var tempR;
var tempC;
var baseR;
var baseC;
var baseCase;
var upChecked;
var downChecked;
var rightChecked;
var leftChecked;
var isVertical;
var isHorizontal;

// These arrays are the grids that will allow us to play the game.
let p1GridArr = createArray(10, 9);
let p1GuessArr = createArray(10, 9);
let p2GridArr = createArray(10, 9);
let p2GuessArr = createArray(10, 9);
let AiGridArr = createArray(10, 9);
let AiGuessArr = createArray(10, 9);

/**
* Creates the arrays necessary to store ship positions. This is necessary because JS does not natively support 2D arrays.
*
* @param {int} length - The length needed for each dimension of the array.
* @return {array} - an n-dimensional array based upon how many args you passed for length.
* @author Drew Fink - adapted from StackOverflow answer by Matthew Crumley
*/
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) // This just adds the specified number of dimensions to the array based upon how many arguments you feed createArray()
    {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args); // Recursively add the correct number of dimensions to the array.
    }

    return arr;
}

/**
* Function that generates and populates all of the play-boards seen on the page, and embeds them with the appropriate functionality.
*
* @param {int} rows - The number of rows needed in the generated board.
* @param {int} cols - The number of columns needed in the generated board.
* @param {string} classname - The name of the HTML class the grid should belong to, for the purpose of CSS.
* @param {function} callback - Allows for a custom function within each grid.
* @author Drew Fink - adapted from StackOverflow answer by "Phrogz"
*/
function playBoard(rows, cols, classname, callback) // The "callback" is a function we use for our event listener.
{
    var letter = 65; // 65 is ASCII for the letter A. We use this when numbering the grid.
    var i = 1; // This is also used for numbering the grid.
    var grid = document.createElement('table');


    grid.className = classname; // Determines if it's the 1st or 2nd player grid
    for (var r = 0; r < rows; ++r) {
        var tr = grid.appendChild(document.createElement('tr')); // Put a new row in
        for (var c = 0; c < cols; ++c) {
            var cell = tr.appendChild(document.createElement('td')); // Put a new column in
            cell.innerHTML = `${String.fromCharCode(letter)}${i++}`; // Insert the grid number, like A1, B2, C3 etc.
            if (grid.className == "p1-grid") {
                if (p1GridArr[r][c] == 1) {
                    cell.className = 'clicked';
                }
                if (p1GridArr[r][c] == 2) {
                    cell.className = 'hit';
                }
                if (p1GridArr[r][c] == 3) {
                    cell.className = 'benign';
                }
            }
            if (grid.className == "p2-grid") {
                if (p2GridArr[r][c] == 1) {
                    cell.className = 'clicked';
                }
                if (p2GridArr[r][c] == 2) {
                    cell.className = 'hit';
                }
                if (p2GridArr[r][c] == 3) {
                    cell.className = 'benign';
                }
            }

            else if (easyMode) // Implementation of Easy AI opponent
            {
                if (grid.className != "p2-guess") {
                    cell.addEventListener('click', (function (element, r, c, i) // This inserts a "listener" for the event so that we know when it's clicked.
                    {
                        return function () {
                            callback(element, r, c, i); // Pass the element, rows, columns, and item number back.
                        }
                    })(cell, r, c, i), false);
                }

                else {
                    cell.addEventListener('click', (function (element, r, c, i) // This inserts a "listener" for the event so that we know when it's clicked.
                    {
                        return function () {
                            randomC = (Math.floor(Math.random() * Math.floor(10))); //stores a random col number to hit board
                            randomR = (Math.floor(Math.random() * Math.floor(9))); //row coordinate for random hit
                            if (p1GridArr[randomC][randomR] != 2)
                                    callback(element, randomR, randomC, i); // Pass the element, rows, columns, and item number back.
                                else {
                                    randomC = (Math.floor(Math.random() * Math.floor(10))); //stores a random col number to hit board
                                    randomR = (Math.floor(Math.random() * Math.floor(9))); //row coordinate for random hit
                                }
                        }
                    })(cell, r, c, i), false);

                    // sets autoClick on AI's turn, gameEnded is to avoid infinite alerts after gameOver
                    setInterval(function () {
                      if (onAi && curPlyr != 1 && !gameEnded) {
                        cell.click();
                      }
                    }, 5000);
                }
            }


            else if (mediumMode) // Implementation of Medium AI opponent
            {
                if (grid.className != "p2-guess") {
                    cell.addEventListener('click', (function (element, r, c, i) // This inserts a "listener" for the event so that we know when it's clicked.
                    {
                        return function () {
                            callback(element, r, c, i); // Pass the element, rows, columns, and item number back.
                        }
                    })(cell, r, c, i), false);
                }

                else {
                    cell.addEventListener('click', (function (element, r, c, i) // This inserts a "listener" for the event so that we know when it's clicked.
                    {
                        return function () {
                            if (!isHit) {
                                randomC = (Math.floor(Math.random() * Math.floor(10))); //stores a random col number to hit board
                                randomR = (Math.floor(Math.random() * Math.floor(9))); //row coordinate for random hit

                                if (p1GridArr[randomR][randomC] == 1 && p1GridArr[randomC][randomR] != 2) // if there is a ship at random coordinates
                                {
                                    isHit = true;
                                    newShip = true;
                                    baseR = randomR;
                                    baseC = randomC;
                                }

                                callback(element, randomR, randomC, i); // Pass the element, rows, columns, and item number back.
                            }

                            else if (isHit) {
                              if (newShip) // initialize all values if random shot hits ship
                              {
                                tempR = baseR;
                                tempC = baseC;

                                upChecked = false;
                                downChecked = false;
                                rightChecked = false;
                                leftChecked = false;

                                isVertical = false;
                                isHorizontal = false;

                                newShip = false;
                              }

                              if (baseCase) // save initial coordinates that random shot hit
                              {
                                tempR = baseR;
                                tempC = baseC;
                                baseCase = false;
                              }

                              // note: randomR and randomC are the baseCoordinates to check from

                              if (isVertical) // skip horizontal checks if ship appears to be vertical
                              {
                                rightChecked = true;
                                leftChecked  = true;
                              }

                              else if (isHorizontal) // skip horizontal checks if ship appears to be horizontal
                              {
                                upChecked   = true;
                                downChecked = true;
                              }


                              // up case
                              if (!upChecked)
                              {
                                tempR = tempR-1;
                                if (tempR >= 0 && p1GridArr[tempR][tempC] != 2) // make sure we are not going off grid && spot has not already been hit
                                {
                                  if (p1GridArr[tempR][tempC] == 1) // if ship at coordinte, assume ship is vertical
                                  {
                                    isVertical = true;
                                  }

                                  else
                                  {
                                    upChecked = true; // skip case since there is no ship
                                    baseCase = true; // next check will start at oringal hit coordinates
                                  }

                                  return callback(element, tempR, tempC, i);
                                }

                                else // if going off grid or spot has been previously hit
                                {
                                  upChecked = true;
                                  tempR = baseR; // next check will start at oringal hit coordinates
                                  tempC = baseC;
                                }
                              }


                              // down case
                              if (!downChecked)
                              {
                                tempR = tempR+1;
                                if (tempR < 10 && p1GridArr[tempR][tempC] != 2) // make sure we are not going off grid && spot has not already been hit
                                {
                                  if (p1GridArr[tempR][tempC] == 1) // if ship at coordinte, assume ship is vertical
                                  {
                                    isVertical = true;
                                  }

                                  else
                                  {
                                    downChecked = true;

                                    if (isVertical) // only end if ship was assumed vertical, if not, check horizontal
                                    {
                                      isHit = false; // reached end of vertical ship, go back to random
                                      baseCase = true; // next check will start at oringal hit coordinates
                                    }

                                    else // if it was not vertical, skip up/down cases
                                    {
                                      isHorizontal = true;
                                    }
                                  }

                                  return callback(element, tempR, tempC, i);
                                }

                                else // if going off grid or spot has been previously hit
                                {
                                  downChecked = true;

                                  if (isVertical) // only end if ship was assumed vertical, if not, check horizontal
                                  {
                                    isHit = false;
                                  }

                                  else // if it was not vertical, skip up/down cases
                                  {
                                    isHorizontal = true;
                                  }

                                  tempR = baseR; // next check will start at oringal hit coordinates
                                  tempC = baseC;
                                }

                              }


                              // left case
                              if (!leftChecked)
                              {
                                tempC = tempC-1;
                                if (tempR < 9 && p1GridArr[tempR][tempC] != 2) // make sure we are not going off grid && spot has not already been hit
                                {
                                  if (p1GridArr[tempR][tempC] == 1) // if ship at coordinte, assume ship is horizontal
                                  {
                                    isHorizontal = true;
                                  }

                                  else
                                  {
                                    leftChecked = true;
                                    baseCase = true; // next check will start at oringal hit coordinates
                                  }

                                  return callback(element, tempR, tempC, i);
                                }

                                else // if going off grid or spot has been previously hit
                                {
                                  leftChecked = true;
                                  tempR = baseR; // next check will start at oringal hit coordinates
                                  tempC = baseC;
                                }
                              }


                              // right case
                              if (!rightChecked)
                              {
                                tempC = tempC+1;
                                if (tempR < 9 && p1GridArr[tempR][tempC] != 2) // make sure we are not going off grid && spot has not already been hit
                                {
                                  if (p1GridArr[tempR][tempC] == 1) // if ship at coordinte, assume ship is horizontal
                                  {
                                    isHorizontal = true;
                                  }

                                  else
                                  {
                                    rightChecked = true;
                                    isHit = false;
                                  }

                                  return callback(element, tempR, tempC, i);
                                }

                                else // if going off grid or spot has been previously hit
                                {
                                  rightChecked = true;
                                  isHit = false; // go back to random hits
                                }
                              }

                              // if this is reached, hit randomly again
                              isHit = false;
                              randomC = (Math.floor(Math.random() * Math.floor(10))); //stores a random col number to hit board
                              randomR = (Math.floor(Math.random() * Math.floor(9))); //row coordinate for random hit
                              callback(element, randomR, randomC, i); // Pass the element, rows, columns, and item number back.

                          } // end if (isHit == true) case

                        }
                    })(cell, r, c, i), false);

                    // sets autoClick on AI's turn, gameEnded is to avoid infinite alerts after gameOver
                    setInterval(function () {
                      if (onAi && curPlyr != 1 && !gameEnded) {
                        cell.click();
                      }
                    }, 5000);
                }
            }


            else if (hardMode) // Implementation of Hard AI opponent
            {
                if (grid.className != "p2-guess") {
                    cell.addEventListener('click', (function (element, r, c, i) // This inserts a "listener" for the event so that we know when it's clicked.
                    {
                        return function () {
                            callback(element, r, c, i); // Pass the element, rows, columns, and item number back.
                        }
                    })(cell, r, c, i), false);
                }

                else {
                    cell.addEventListener('click', (function (element, r, c, i) // This inserts a "listener" for the event so that we know when it's clicked.
                    {
                        return function () {
                            for (var row = 0; row < 10; row++) {
                                for (var col = 0; col < 9; col++) {
                                    if (p1GridArr[row][col] == 1) { //find the ship on the grid.
                                        r = row;
                                        c = col;
                                    }
                                }
                            }
                            callback(element, r, c, i); // Pass the element, rows, columns, and item number back.
                        }

                    })(cell, r, c, i), false);

                    // sets autoClick on AI's turn, gameEnded is to avoid infinite alerts after gameOver
                    setInterval(function () {
                      if (onAi && curPlyr != 1 && !gameEnded) {
                        cell.click();
                      }
                    }, 5000);

                }
            }


            else {
                cell.addEventListener('click', (function (element, r, c, i) // This inserts a "listener" for the event so that we know when it's clicked.
                {
                    return function () {
                        callback(element, r, c, i); // Pass the element, rows, columns, and item number back.
                    }
                })(cell, r, c, i), false);
            }

        }
        i = 1;
        letter++;
    }
    return grid;
}

/**
* Asks for startpoint and endpoint of ship, then formats them to work with the grid.
*
* @param {int} shipNum - The sequential number of the ship being placed.
* @post The coordinates of the ship are returned.
* @author Zach Sambol - adapted from newbedev solution
*/

function getCoords(shipNum) {
    let coordString = window.prompt("Enter Starting Point for Ship " + shipNum + " as a Grid ID (ex. B3) within A-J, 1-9");
    coordSplit = coordString.split("");
    let coordX1 = parseInt(coordSplit[1]) - 1;		//Both coords normalized to grid format (begins with 0) (goes row, column)
    let coordY1 = parseInt(coordSplit[0], 36) - 10;

    coordString = window.prompt("Enter Ending Point for Ship " + shipNum + " as a Grid ID (ex. B3)");
    coordSplit = coordString.split("");
    let coordX2 = parseInt(coordSplit[1]) - 1;		//Both coords normalized to grid format (begins with 0) (goes row, column)
    let coordY2 = parseInt(coordSplit[0], 36) - 10;

    let coordTogether = [coordY1, coordX1, coordY2, coordX2];

    return (coordTogether);
}

/**
* Just makes sure startpoint and endpoint are in either same row or column, does not check size.
*
* @pre A ship has been placed and its coordinates need to be checked to ensure they're in the same row or column.
* @param {int} toCheck - The coordinates of the ship being placed.
* @post True if the ship is orthogonal, false if not.
* @author Zach Sambol
*/
function isOrthogonal(toCheck) {
    if (toCheck[0] == toCheck[2] || toCheck[1] == toCheck[3]) {
        return (true);
    }
    else {
        return (false);
    }
}

/**
* And now, we check if the ships are actually the appropriate size.
*
* @pre A ship has been placed and its coordinates need to be checked to ensure the size is correct.
* @param {int} toCheck - The coordinates of the ship being placed.
* @param {int} size - The size of the ship being placed.
* @post True if the ship is correctly-sized, false if not.
* @author Zach Sambol
*/
function isSize(toCheck, size) {
    // If we have a ship of size one, all we need to do is check if the two spots are equivalent.
    if (toCheck[0] == toCheck[2] && toCheck[1] == toCheck[3] && size == 1) {
        return (true);
    }
    // For ships of bigger sizes, we need to check based upon the provided size. Messy because of absolute values.
    else if (toCheck[0] == toCheck[2] && (((toCheck[1] - toCheck[3]) == size - 1) || ((toCheck[3] - toCheck[1]) == size - 1))) {
        return (true);
    }
    else if (toCheck[1] == toCheck[3] && (((toCheck[0] - toCheck[2]) == size - 1) || ((toCheck[2] - toCheck[0]) == size - 1))) {
        return (true);
    }
    else {
        return (false);
    }

}

/**
* Checks if the ship's coordinates are within the game board.
*
* @pre A ship has been placed and its coordinates need to be checked to ensure it's actually within the board.
* @param {int} toCheck - The coordinates of the ship being placed.
* @post True if the ship is in the board, false if not.
* @author Zach Sambol
*/
function isWithinBounds(toCheck) {
    if (toCheck[0] > 9 || toCheck[0] < 0 || toCheck[1] > 8 || toCheck[1] < 0 || toCheck[2] > 9 || toCheck[2] < 0 || toCheck[3] > 8 || toCheck[3] < 0) {
        return (false);
    }
    else {
        return (true);
    }
}

/**
* Checks to make sure you aren't placing ships on top of each other
*
* @pre A ship has been placed and its coordinates need to be checked to ensure that it's not being put on top of another ship.
* @param {int} toCheck - The coordinates of the ship being placed.
* @param {int} playerGrid - The grid for the active player.
* @post False if the ship is clear, true if not.
* @author Zach Sambol
*/
function isOnEmpty(toCheck, playerGrid) {
    let pass = true;
    if (toCheck[0] == toCheck[2] && toCheck[1] == toCheck[3] && playerGrid[toCheck[0]][toCheck[1]] == 0) {
        return (true);
    }
    else if (toCheck[0] == toCheck[2]) {
        if (toCheck[1] < toCheck[3]) {
            for (let j = toCheck[1]; j <= toCheck[3]; j++) {
                if (playerGrid[toCheck[0]][j] == 1) {
                    pass = false;
                }
            }
        }
        else {
            for (let j = toCheck[3]; j <= toCheck[1]; j++) {
                if (playerGrid[toCheck[0]][j] == 1) {
                    pass = false;
                }
            }
        }
    }
    else if (toCheck[1] == toCheck[3]) {
        if (toCheck[0] < toCheck[2]) {
            for (let j = toCheck[0]; j <= toCheck[2]; j++) {
                if (playerGrid[j][toCheck[1]] == 1) {
                    pass = false;
                }
            }
        }
        else {
            for (let j = toCheck[2]; j <= toCheck[0]; j++) {
                if (playerGrid[j][toCheck[1]] == 1) {
                    pass = false;
                }
            }
        }
    }
    else {
        return (false);
    }
    return (pass);
}

/**
* Populates the ship arrays with player-provided ship positions.
*
* @pre An array is generated, but is empty and so needs ships to be placed in it.
* @param {array} arr - The array that will be filled with the ships.
* @post The array is filled with ships (denoted as 1).
* @author Zach Sambol & Drew Fink
*/
function placeShips(arr) {
    var coords = [];
    var doesPass;
    var passError;

    for (let i = 1; i <= amntShips; i++) {								//this gets coords and runs above tests to see if they are fit

        do {
            if (AIgame == true && onAi == true) {
                coords = getAiCoords(i);
            }
            else {
                alert("Placing Ship " + i + ", Size: 1x" + i);
                coords = getCoords(i);
            }

            doesPass = false;
            passError = 0;

            if (isOrthogonal(coords) == true) {
                if (isSize(coords, i) == true) {
                    if (isWithinBounds(coords) == true) {
                        if (isOnEmpty(coords, arr) == true) {			//isOnEmpty MUST BE CALLED AFTER isWithinBounds - causes errors if looking outsite arr
                            doesPass = true;
                            console.log(isOnEmpty(coords, arr));
                        }
                        else {
                            passError = 1;
                        }
                    }
                    else {
                        passError = 2;
                    }
                }
                else {
                    passError = 3;
                }
            }
            else {
                passError = 4;
            }

            switch (passError) {
                case 0:
                    if (!onAi) {
                        alert("Ship Placed!");
                    }
                    break;
                case 1:
                    if (!onAi) {
                        alert("Ship overlaps another ship. Try again.");
                    }
                    break;
                case 2:
                    if (!onAi) {
                        alert("Ship is out of bounds of the game board. Try again.");
                    }
                    break;
                case 3:
                    if (!onAi) {
                        alert("Coordinate range does not match ship size. Try again.");
                    }
                    break;
                case 4:
                    if (!onAi) {
                        alert("Ship is not horizontal or vertical. Try again.");
                    }
                    break;

            }

        } while (doesPass == false);

        //below if-blocks decide how to and place ships on arr
        //again, avoiding use of absolute value
        if (coords[0] == coords[2] && coords[1] == coords[3]) {
            arr[coords[0]][coords[1]] = 1;

            console.log("Using placement 1");
            console.log("Placed ship " + i + " at Row, Column " + coords[0] + ", " + coords[1]);
        }
        else if (coords[0] == coords[2]) {
            if (coords[1] < coords[3]) {
                for (let startX = coords[1]; startX <= coords[3]; startX++) {
                    arr[coords[0]][startX] = 1;

                    console.log("Using placement 2");
                    console.log("Placed ship " + i + " at Row, Column " + coords[0] + ", " + coords[startX]);
                }
            }
            else {
                for (let startX = coords[3]; startX <= coords[1]; startX++) {
                    arr[coords[0]][startX] = 1;

                    console.log("Using placement 3");
                    console.log("Placed ship " + i + " at Row, Column " + coords[0] + ", " + coords[startX]);
                }
            }
        }
        else if (coords[1] == coords[3]) {
            if (coords[0] < coords[2]) {
                for (let startY = coords[0]; startY <= coords[2]; startY++) {
                    arr[startY][coords[1]] = 1;

                    console.log("Using placement 4");
                    console.log("Placed ship " + i + " at Row, Column " + coords[startY] + ", " + coords[1]);
                }
            }
            else {
                for (let startY = coords[2]; startY <= coords[0]; startY++) {
                    arr[startY][coords[1]] = 1;

                    console.log("Using placement 5");
                    console.log("Placed ship " + i + " at Row, Column " + coords[startY] + ", " + coords[1]);
                }
            }
        }
    }
}


/**
* Changes turn after a player has made a move and hides the grids accordingly.
*
* @pre A player has just made a move and has been informed of whether their move was a hit or a miss.
* @post The interface has now switched so the other player can make a move.
* @author Andrew Brown & Drew Fink
*/
function changeTurn() {
    if (curPlyr == 1) {
        var p2HasShips = false;
        for (var r = 0; r < 10; r++) {
            for (var c = 0; c < 9; c++) {
                if (p2GridArr[r][c] == 1) {
                    p2HasShips = true;
                }
            }
        }
        if (p2HasShips) {
            p1Grid.style.display = "none";
            p1Guess.style.display = "none";
            if (!onAi) {
                setTimeout(() => alert("Okay, Player 1, turn your back, and Player 2, press OK to advance."), 0); // These three lines use setTimeout to ensure the grid is properly hidden BEFORE the alert. It doesn't actually hide otherwise. It's a dumb JS quirk.
                setTimeout(() => p2Grid.style.display = "inline", 0);
            }
            else {
                // setTimeout(() => alert("AI's turn. Click anywhere on the board to continue."), 0); // These three lines use setTimeout to ensure the grid is properly hidden BEFORE the alert. It doesn't actually hide otherwise. It's a dumb JS quirk.
                setTimeout(() => p2Grid.style.display = "none", 0);
            }
            setTimeout(() => p2Guess.style.display = "inline", 0);
            curPlyr++;
        }
        else {
            const gameOver = document.getElementById("over");
            alert("Game over, Player 1 wins!");
            gameOver.play();
            gameEnded = true;
        }
    }
    else {
        var p1HasShips = false;
        for (var r = 0; r < 10; r++) {
            for (var c = 0; c < 9; c++) {
                if (p1GridArr[r][c] == 1) {
                    p1HasShips = true;
                }
            }
        }
        if (p1HasShips) {
            p2Grid.style.display = "none";
            p2Guess.style.display = "none";
            if (!onAi) {
                setTimeout(() => alert("Okay, Player 2, turn your back, and Player 1, press OK to advance."), 0); // These three lines use setTimeout to ensure the grid is properly hidden BEFORE the alert. It doesn't actually hide otherwise. It's a dumb JS quirk.
            }
            else {
                // setTimeout(() => alert("AI turn is over. Player 1, press OK to advance"), 0); // These three lines use setTimeout to ensure the grid is properly hidden BEFORE the alert. It doesn't actually hide otherwise. It's a dumb JS quirk.

            }
            setTimeout(() => p1Grid.style.display = "inline", 0);
            setTimeout(() => p1Guess.style.display = "inline", 0);
            curPlyr--;
        }
        else {
            const gameOver = document.getElementById("over");
            if (!onAi) {
                alert("Game over, Player 2 wins!");
            }
            else {
                alert("Game over, AI wins!");
            }
            gameOver.play();
            gameEnded = true;
        }
    }
    document.getElementById("playerNum").innerHTML = curPlyr;
}

/**
* Function used to make sure Background Music isn't too loud so extra sounds can be heard
* adapted from Nell Martinez's “Lower Background Music Volume When Autoplay HTML.”
* @pre none
* @post lowers volume
* @author Jui Nagarkar
*/
function lowerVolume() {
    var backgroundMusic = document.getElementById("background");//background music
    backgroundMusic.volume = 0.1;// lowers music
}

/**
* Draws the ship placement grids and guessing grids to the screen, and provides for redrawing them to show guesses by the other player.
*
* @pre The ships have been placed in the grid arrays but they have not been drawn to the screen.
* @post The grids are now visible to the player.
* @author Drew Fink & Andrew Brown
*/
function drawGrids() {
    //music adapted from Mark Lassoff's “Coding Sound with Javascript: Beginner's Guide.”
    const hitShip = document.getElementById("hit");//plays music for hit
    const missShip = document.getElementById("miss");//plays music for miss
    var player1grid = playBoard(10, 9, "p1-grid", function (cell, row, col, i) { });

    var player2grid = playBoard(10, 9, "p2-grid", function (cell, row, col, i) { });

    var player1guess = playBoard(10, 9, "p1-guess", function (cell, row, col, i) {
        if (p2GridArr[row][col] == 1) {
            p2GridArr[row][col] = 2;
            hitShip.play();//plays hit sound effect
            alert("It's a hit!");
            cell.className = 'hit';

        }
        else {
            p2GridArr[row][col] = 3;
            missShip.play();//plays miss sound effect
            alert("It's a miss.");
            cell.className = 'clicked';

        }
        document.getElementById("boards").removeChild(player2grid); // Redraw player 2's bottom grid so that it reflects where player 1 has guessed.
        player2grid = playBoard(10, 9, "p2-grid", function (cell, row, col, i) { });
        p2Grid = document.getElementById("boards").appendChild(player2grid);
        p2Grid.setAttribute("id", "p2Grid");
        p2Grid.style.display = "none";

        changeTurn();
    });


    var player2guess = playBoard(10, 9, "p2-guess", function (cell, row, col, i) {
        const hitShip = document.getElementById("hit");
        const missShip = document.getElementById("miss");
        if (p1GridArr[row][col] == 1) {
            p1GridArr[row][col] = 2;
            hitShip.play();
            if (!onAi) alert("It's a hit!");
            else       alert("AI hit your ship!"); // comment this line out to skip AI view
            cell.className = 'hit';
        }
        else {
            p1GridArr[row][col] = 3;
            missShip.play(); //still has error back up to old version.
            if (!onAi) alert("It's a miss.");
            else       alert("AI missed!"); // comment this line out to skip AI view
            cell.className = 'clicked';
        }
        document.getElementById("boards").removeChild(player1grid); // Redraw player 1's bottom grid so that it reflects where player 2 has guessed.
        player1grid = playBoard(10, 9, "p1-grid", function (cell, row, col, i) { });
        p1Grid = document.getElementById("boards").appendChild(player1grid);
        p1Grid.setAttribute("id", "p1Grid");
        p1Grid.style.display = "none";

        changeTurn();
    });

    // At this point we do some initial setup for the grids and start the game proper.
    p1Guess = document.getElementById("guessBoards").appendChild(player1guess); // Do an initial drawing of all the grids.
    p1Guess.setAttribute("id", "p1Guess");

    p1Grid = document.getElementById("boards").appendChild(player1grid);
    p1Grid.setAttribute("id", "p1Grid");

    p2Guess = document.getElementById("guessBoards").appendChild(player2guess);
    p2Guess.setAttribute("id", "p2Guess");

    p2Grid = document.getElementById("boards").appendChild(player2grid);
    p2Grid.setAttribute("id", "p2Grid");
}

/**
* Initiates the game by placing the ships and initializing the grids.
*
* @pre The players need to be ready to start the game.
* @post The game has been started.
* @author Raj Nara & Drew Fink
*/
function gameHandler() {
    alert("Next prompt will ask for the number of ships in play. Amount of ships corresponds with ship size. Ex. 1 ship gives each player a 1x1 ship. 3 ships gives each player a 1x1, 1x2, and 1x3 ship to place.");

    do {
        amntShips = window.prompt("Enter amount of ships for each player (1 - 6)");

        if (amntShips != null) {
            amntShips = parseInt(amntShips, 10);		//forces int input
        }

    } while (((amntShips <= 6) && (amntShips >= 1)) != true);

    alert("Player 1 will place ships first. Each ship placement will require 2 coordinates: a start and endpoint. For example, a 1x3 ship with start point A1 and end point A3 will occupy tiles A1, A2, and A3. As long as points are horizontal or vertical to each other, order does not matter.");

    placeShips(p1GridArr);

    alert("Player 2 will now place ships.");

    placeShips(p2GridArr);

    document.getElementById('player2').disabled = 'disabled';
    document.getElementById("playerNum").innerHTML = curPlyr;

    drawGrids();
    document.getElementById("grid").style.display = "none";//hides sample board
    alert("Okay Player 1, you start. Player 2, turn your back.");
    setTimeout(() => p1Grid.style.display = "inline", 0); // Again using the setTimeout "trick" to ensure the alert plays first (whereas it never does otherwise)
    setTimeout(() => p1Guess.style.display = "inline", 0);
    setTimeout(() => p2Grid.style.display = "none", 0);
    setTimeout(() => p2Guess.style.display = "none", 0);
}

/**
* Initiates the game by placing the ships and initializing the grids.
*
* @pre The players need to be ready to start the game.
* @post The game has been started.
* @author Chen Lu, Natasha Shirley, Andrew Loaiza
*/
function gameAIhandler(choice) {
    alert("Next prompt will ask for the number of ships in play. Amount of ships corresponds with ship size. Ex. 1 ship gives each player a 1x1 ship. 3 ships gives each player a 1x1, 1x2, and 1x3 ship to place.");
    AIgame = true;
    do {
        amntShips = window.prompt("Enter amount of ships for each player (1 - 6)");

        if (amntShips != null) {
            amntShips = parseInt(amntShips, 10);		//forces int input
        }

    } while (((amntShips <= 6) && (amntShips >= 1)) != true);

    alert("Player 1 will place ships first. Each ship placement will require 2 coordinates: a start and endpoint. For example, a 1x3 ship with start point A1 and end point A3 will occupy tiles A1, A2, and A3. As long as points are horizontal or vertical to each other, order does not matter.");

    placeShips(p1GridArr);

    alert("AI will now place their ships.");
    onAi = true;
    placeShips(p2GridArr);

    if (choice == 1) {
        easyMode = true;
        document.getElementById('easyAI').disabled = 'disabled';
        document.getElementById("playerNum").innerHTML = curPlyr;
    }
    if (choice == 2) {
        mediumMode = true;
        document.getElementById('mediumAI').disabled = 'disabled';
        document.getElementById("playerNum").innerHTML = curPlyr;
    }
    if (choice == 3) {
        hardMode = true;
        document.getElementById('hardAI').disabled = 'disabled';
        document.getElementById("playerNum").innerHTML = curPlyr;
    }
    drawGrids();
    document.getElementById("grid").style.display = "none";
    alert("Okay Player 1, you start. AI, turn your back.");
    setTimeout(() => p1Grid.style.display = "inline", 0); // Again using the setTimeout "trick" to ensure the alert plays first (whereas it never does otherwise)
    setTimeout(() => p1Guess.style.display = "inline", 0);
    setTimeout(() => p2Grid.style.display = "none", 0);
    setTimeout(() => p2Guess.style.display = "none", 0);
}

/**
* Initiates the game by placing the ships and initializing the grids.
*
* @pre number of ships
* @post returns random numbers
* @author Chen Lu
*/
function getAiCoords(shipNum) {

    let coordX1 = 0;
    let coordY1 = 0;
    // for (let i = 0; i <= (shipNum - 1); i++) -----the ship is place 1 by 1 call the coords everytime so change it

    try {
        if (Math.random() > 0.5)  // we can use >0.5 = horizontal or any value bettwen 0-1.
        {
            //adapted from "Random Variable Javascript Code Example"
            coordX1 = (Math.floor(Math.random() * Math.floor(9 - (shipNum - 1))));// Math.random output 0<x<1  max ship is 1x6 when the shipNum = 6 we only can do 0,1,2 Floor will return a int;
            coordY1 = (Math.floor(Math.random() * Math.floor(9)));
            let coordTogether = [coordY1, coordX1, coordY1, coordX1 + (shipNum - 1)];// + ship number to get next coordx  and return coord to set ship
            return (coordTogether);
        }
        else {
            coordX1 = (Math.floor(Math.random() * Math.floor(9 - (shipNum - 1))));// Math.random output 0<x<1  max ship is 1x6 when the shipNum = 6 we only can do 0,1,2 Floor will return a int;
            coordY1 = (Math.floor(Math.random() * Math.floor(9)));
            let coordTogether = [coordY1, coordX1, coordY1 + (shipNum - 1), coordX1];// + ship number to get next coordx  and return it to set ship
            return (coordTogether);
        }
    } catch (e) {
    }
}
