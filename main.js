const PlayerFactory = (xory) => {
    let isTurn = false;
    //this is never read but useful to have for future dev.
    const token = xory;

    const toggleTurn = bool => isTurn = bool;
    const getTurn = () => isTurn;
    return {toggleTurn, getTurn};
};

//This could inherit from PlayerFactory 
const aiFactory = (xory) => {
    let isTurn = fasle;
    const token = xory;

    const toggleTurn = bool => isTurn = bool;
    const getTurn = () => isTurn;
    const makeDecision = () => {




    };
    return {toggleTurn, getTurn, makeDecision};
}

const Gameboard = (() => {
    let grid = [["","",""],["","",""],["","",""]];
    let cells = document.querySelectorAll(".cell");
    let overlay = document.getElementById("winOverlay");

    const toggleOverlay = (toggle, winner) => {
        overlay.style.display = toggle ? "block" : "none";
        overlay.firstElementChild.innerHTML = `${winner} Wins the game!`;
    };
    const renderBoard = () => {
        cells.forEach(cell =>{
            cell.innerHTML = grid[cell.dataset.x][cell.dataset.y];
        });
    };
    const placeToken = (e) => {
        if(e.target.innerHTML == ""){
            grid[e.target.dataset.x][e.target.dataset.y] = DisplayController.getPlayerTurn();
            renderBoard();
            if(checkWin( DisplayController.getPlayerTurn())){
                DisplayController.announceWin();
            };
            DisplayController.changeTurn();
        } else {
            console.log("something exists here already")
        };
    };
    const resetBoard = () => {
        grid = [["","",""],["","",""],["","",""]];
        toggleOverlay(false, "Noone")
        //random colour for cells
        cells.forEach(cell => {
            cell.addEventListener("click", placeToken);
            ranGrey = (Math.random() * (0.6 - 0.3) + 0.3).toFixed(2);
            cell.style.backgroundColor = `rgb(0,0,0,${ranGrey})`;
        });

    }
    const checkWin = (xory) => {
        //REFACTOR WITH FUNCTIONAL MAP OR FILTER?
        let gameOver = false;

        lineCheck([[0,0],[0,1],[0,2]]);
        lineCheck([[1,0],[1,1],[1,2]]);
        lineCheck([[2,0],[2,1],[2,2]]);
        lineCheck([[0,0],[1,0],[2,0]]);
        lineCheck([[0,1],[1,1],[2,1]]);
        lineCheck([[0,2],[1,2],[2,2]]);
        lineCheck([[0,0],[1,1],[2,2]]);
        lineCheck([[0,2],[1,1],[2,0]]);
        

        function lineCheck(cells){
            if (grid[cells[0][0]][cells[0][1]] == xory &&
                grid[cells[1][0]][cells[1][1]] == xory &&
                grid[cells[2][0]][cells[2][1]] == xory){
                gameOver = true;
            };
        }
        return gameOver == true ? true : false;
    }

    return{renderBoard, placeToken, resetBoard, toggleOverlay};
})();

const DisplayController = (() => {
    const docXory = document.getElementById("xory");

    const setup = () => {
        Gameboard.resetBoard();
        Gameboard.renderBoard();
        let resetBtn = document.getElementById("resetBtn");
        resetBtn.addEventListener("click", setup);
        //random player start x just for now
        playerX.toggleTurn(true);
        docXory.innerHTML = "X";
    };
    const changeTurn = () =>{
        if(playerX.getTurn()==true){
            playerX.toggleTurn(false);
            playerO.toggleTurn(true);
            docXory.innerHTML = "O";
        } else {
            playerO.toggleTurn(false);
            playerX.toggleTurn(true);
            docXory.innerHTML = "X";
        }
    };
    const announceWin = (winner) => {
        Gameboard.toggleOverlay(true, getPlayerTurn());
    };
    const getPlayerTurn = () => {
        return playerX.getTurn() == true ? "X" : "O";
    };

    //Make Player Objects
    const playerX = PlayerFactory("X");
    const playerO = PlayerFactory("O");

    //Initial Setup
    setup();
    return{changeTurn, announceWin, getPlayerTurn};
})();

// FUNCTIONS FOR AI
// DisplayController: aiTurn
// DisplayController: Check on changeTurn for pass to ai or not
// Player: isAI? Bool that will be checked.
// AI Play button to switch a player to AI
// AI button to change to 2 Player when hit (toggles)
// MAKE AI ALGORITHM....

