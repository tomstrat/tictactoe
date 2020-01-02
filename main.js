const PlayerFactory = () => {
    let isTurn = fasle;
    const toggleTurn = bool => isTurn = bool;
    const getTurn = () => isTurn;
    return {toggleTurn, getTurn};
};

const Gameboard = (() => {
    let grid = [[x,o,x][o,x,o][x,x,x]]
    const updateCell = (x, y, player) => grid[x][y] = player;
    const checkValidMove = (x, y) => {
        grid[x][y] = undefined ? true:false;
    };
    const checkWin = () => {

    };
    return{updateCell, checkValidMove, checkWin};
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


    return{changeTurn};
})();

const playerX = PlayerFactory();
const playerO = PlayerFactory();