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
    let isTurn = false;
    const token = xory;

    const toggleTurn = bool => isTurn = bool;
    const getTurn = () => isTurn;
    const makeDecision = () => {
        let x, y;

        //Block Win
        Gameboard.checkBlock();
        
        //Human played Center First

        //Human played Corner First



        Gameboard.aiPlaceToken([x,y])
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
    const checkBlock = () => {
        //This should tell the AI where X is and determine if it should block
        let locations = [];
        let danger = false;
        for(let i=0; i<grid.length;i++){
            for(let j=0; j<grid[i].length;j++){
                if(grid[i][j] == "X"){
                    locations.push([i,j]);
                }
            }
        }
        //Loop through locations and query their neighbours to see if there is Danger and block required
        locations.forEach((x, y) =>{
            danger = checkNeighbours(x, y);
            if(danger){
                break;
            }
        });
        return danger;
    }
    const checkNeighbours = (x, y) => {
        if(grid[(x + 1) % 3][y] == "X" ||
           grid[(x + 3) % 3][y] == "X" ||
           grid[x][(y + 1) % 3] == "X" ||
           grid[x][(y + 3) % 3] == "X"){
            return true;
        } else {
            return false;
        }
    }
    const aiPlaceToken = (id) => {
        grid[id[0]][id[1]] = DisplayController.getPlayerTurn();
        renderBoard();
        if(checkWin( DisplayController.getPlayerTurn())){
            DisplayController.announceWin();
        };
        DisplayController.changeTurn();
    }
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

    return{renderBoard, placeToken, resetBoard, toggleOverlay, aiPlaceToken, checkBlock};
})();

const DisplayController = (() => {
    const docXory = document.getElementById("xory");
    const resetBtn = document.getElementById("resetBtn");
    const aiBtn = document.getElementById("aiBtn");
    let aiGame = false;

    const setup = () => {
        Gameboard.resetBoard();
        Gameboard.renderBoard();
        resetBtn.addEventListener("click", setup);
        aiBtn.addEventListener("click", makeAiGame);
        //random player start x just for now
        playerX.toggleTurn(true);
        docXory.innerHTML = "X";
    };
    const changeTurn = () =>{
        if(playerX.getTurn()==true){
            playerX.toggleTurn(false);
            playerO.toggleTurn(true);
            playerAI.toggleTurn(true);

            if(aiGame){
                docXory.innerHTML = "AI";
                playerAI.makeDecision();
            } else {
                docXory.innerHTML = "O";
            }

        } else {
            playerO.toggleTurn(false);
            playerAI.toggleTurn(false);
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
    const makeAiGame = () => {
        aiGame = true;
        // add button switch
    };

    //Make Player Objects
    const playerX = PlayerFactory("X");
    const playerO = PlayerFactory("O");
    const playerAI = aiFactory("O");

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

