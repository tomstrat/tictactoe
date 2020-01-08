const PlayerFactory = (xory) => {
    let isTurn = false;
    const token = xory;

    const toggleTurn = bool => isTurn = bool;
    const getTurn = () => isTurn;
    const getToken = () => token;
    return {toggleTurn, getTurn, getToken};
};

const Gameboard = (() => {
    let grid = [["","",""],["","",""],["","",""]];
    let cells = document.querySelectorAll(".cell");

    const renderBoard = (checkWin) => {
        cells.forEach(cell =>{
            cell.innerHTML = grid[cell.dataset.x][cell.dataset.y];
        });
    };
    const placeToken = (e) => {
        if(e.target.innerHTML == ""){
            grid[e.target.dataset.x][e.target.dataset.y] = DisplayController.getPlayerTurn().getToken();
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

    return{renderBoard, placeToken, resetBoard};
})();

const DisplayController = (() => {
    const setup = () => {
        Gameboard.resetBoard();
        Gameboard.renderBoard();
        let cells = document.querySelectorAll(".cell");
        let resetBtn = document.getElementById("resetBtn");
        resetBtn.addEventListener("click", setup);
        cells.forEach(cell => {
            cell.addEventListener("click", Gameboard.placeToken);
        });
        //random player start x just for now
        playerX.toggleTurn(true);
    };
    const changeTurn = () =>{
        if(playerX.getTurn()==true){
            playerX.toggleTurn(false);
            playerO.toggleTurn(true);
        } else {
            playerO.toggleTurn(false);
            playerX.toggleTurn(true);
        }
    };
    const announceWin = (winner) => {
        console.log("you win!");
    };
    const getPlayerTurn = () => {
        return playerX.getTurn() == true ? playerX : playerO;
    };

    //Make Player Objects
    const playerX = PlayerFactory("X");
    const playerO = PlayerFactory("O");

    //Initial Setup
    setup();
    return{changeTurn, announceWin, getPlayerTurn};
})();

