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

        if(this.innerHTML != "" || undefined){
            grid[this.dataset.x][this.dataset.y] = DisplayController.getPlayerTurn().getToken();
            renderBoard();
            DisplayController.checkWin();
            DisplayController.changeTurn();
        } else {
            console.log("something exists here already")
        };
    };

    return{updateCell, checkValidMove, renderBoard, queryGrid, placeToken};
})();

const DisplayController = (() => {
    const setup = () => {

        Gameboard.renderBoard();
        let cells = document.querySelectorAll(".cell");
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
        return playerX.getTurn() = true ? playerX : playerO;
    };

    return{changeTurn, checkWin, getPlayerTurn, setup};
})();

const playerX = PlayerFactory("X");
const playerO = PlayerFactory("O");
DisplayController.setup();