const PlayerFactory = (xory) => {
    let isTurn = false;
    const token = xory;
    const toggleTurn = bool => isTurn = bool;
    const getTurn = () => isTurn;
    const getToken = () => token;
    return {toggleTurn, getTurn, getToken};
};

const Gameboard = (() => {
    let grid = [["X","O","X"],["O","X","O"],["X","X","X"]];
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
    const placeToken = () => {

        if(e.innerHTML != "" || undefined){
            e.innerHTML = DisplayController.getPlayerTurn().getToken();
        };
        DisplayController.checkWin();

        DisplayController.changeTurn();
    };

    return{updateCell, checkValidMove, renderBoard, queryGrid, placeToken};
})();

const DisplayController = (() => {
    const setup = () => {
        let cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.addEventListener(e, Gameboard.placeToken());
        });
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
        return playerX.getTurn() = true ? playerX : playerO;
    };

    return{changeTurn, checkWin, getPlayerTurn};
})();

const playerX = PlayerFactory("X");
const playerO = PlayerFactory("O");
Gameboard.renderBoard();