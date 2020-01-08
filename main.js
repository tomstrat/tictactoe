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

    const updateCell = (x, y, player) => grid[x][y] = player;
    const checkValidMove = (x, y) => {
        grid[x][y] = undefined ? true:false;
    };
    const queryGrid = (x, y) => {
        grid[x][y];
    }
    const renderBoard = (checkWin) => {
        cells.forEach(cell =>{
            cell.innerHTML = grid[cell.dataset.x][cell.dataset.y];
        });
    };
    const placeToken = (e) => {
        if(e.target.innerHTML == ""){
            grid[e.target.dataset.x][e.target.dataset.y] = DisplayController.getPlayerTurn().getToken();
            renderBoard();
            DisplayController.checkWin();
            DisplayController.changeTurn();
        } else {
            console.log("something exists here already")
        };
    };
    const resetBoard = () => {
        grid = [["","",""],["","",""],["","",""]];
    }

    return{updateCell, checkValidMove, renderBoard, queryGrid, placeToken, resetBoard};
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
    const checkWin = () => {

    };
    const getPlayerTurn = () => {
        return playerX.getTurn() == true ? playerX : playerO;
    };

    const playerX = PlayerFactory("X");
    const playerO = PlayerFactory("O");

    setup();
    return{changeTurn, checkWin, getPlayerTurn};
})();

