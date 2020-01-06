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
    const checkWin = () => {

    };
    const renderBoard = () => {
        cells.forEach(cell =>{
            cell.innerHTML = grid[cell.dataset.x][cell.dataset.y];
        });
    };
    return{updateCell, checkValidMove, checkWin, renderBoard};
})();

const DisplayController = (() => {
    const changeTurn = () =>{
        if(playerX.getTurn()==true){
            playerX.toggleTurn(false);
            playerO.toggleTurn(true);
        } else {
            playerO.toggleTurn(false);
            playerX.toggleTurn(true);
        }
    };
    //this returns what to place in a cell X or O
    const returnToken = (turn) =>{

    };

    return{changeTurn};
})();

const playerX = PlayerFactory("X");
const playerO = PlayerFactory("O");
Gameboard.renderBoard();