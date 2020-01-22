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
    let oMemory = [];
    let xMemory = [];

    const toggleTurn = bool => isTurn = bool;
    const getTurn = () => isTurn;
    const queryMemory = (xory, id) => {
        if(xory == "X"){
            for(let i=0; i<xMemory.length;i++){
                if(id[0] == xMemory[i][0] && id[1] == xMemory[i][1]){
                    return true;
                }
            }
            return false;
        } else {
            for(let i=0; i<oMemory.length;i++){
                if(id[0] == oMemory[i][0] && id[1] == oMemory[i][1]){
                    return true;
                }
            }
            return false;
        }
    };
    const clearMemory = () => {
        oMemory = [];
        xMemory = [];
    }
    const makeDecision = () => {
        let x, y;
        let blockWhere = [];
        let winWhere = [];

        //Check first if a win is acheivable
        if(winWhere = Gameboard.checkBlockOrWin("O")){

        }

        //Check next if a block is needed to survive
        if(blockWhere = Gameboard.checkBlockOrWin("X")){
            console.log("I Blocked " + blockWhere[0] + ", " + blockWhere[1])
            memory.push([blockWhere[0],blockWhere[1]]);
            Gameboard.aiPlaceToken(blockWhere);
        };
        
        //Human played Center First

        //Human played Corner First



        // Gameboard.aiPlaceToken([x,y])
    };
    return {toggleTurn, getTurn, makeDecision, queryMemory, clearMemory};
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
            cell.innerHTML = grid[cell.dataset.y][cell.dataset.x];
        });
    };
    const checkBlockOrWin = (xory) => {
        //This should see if X needs blocking or AI can win.
        let locations = [];
        let requiredMove = [false];
        //Cycle through grid to find locations player has played.
        for(let i=0; i<grid.length;i++){
            for(let j=0; j<grid[i].length;j++){
                if(grid[i][j] == xory){
                    locations.push([i,j]);
                }
            }
        }
        //Loop through locations and query their neighbours to see if there is win or block needed
        for(let i=0;i<locations.length;i++){
            requiredMove = checkNeighbours(locations[i][0], locations[i][1], xory);
            //check this hasnt been placed before
            if(DisplayController.askAI("xmemory", requiredMove)){
                requiredMove = false;
            }
            if(requiredMove != false){
                break;
            }
        }
        return requiredMove;
    };
    const checkNeighbours = (x, y, xory) => {
        //Check Up Down Left Right and diagonals
        if (grid[(x + 1) % 3][y] == xory){
            return [(x + 2) % 3, y];
        } else if (grid[(x + 2) % 3][y] == xory){
            return [(x + 1) % 3, y];
        } else if (grid[x][(y + 1) % 3] == xory){
            return [x, (y + 2) % 3];
        } else if (grid[x][(y + 2) % 3] == xory){
            return [x, (y + 1) % 3];
        } else if (grid[(x + 1) % 3][(y + 1) % 3] == xory){
            return [(x + 2) % 3, (y + 2) % 3];
        } else if (grid[(x + 2) % 3][(y + 2) % 3] == xory){
            return [(x + 1) % 3, (y + 1) % 3];
        } else if (grid[(x + 1) % 3][(y + 2) % 3] == xory){
            return [(x + 2) % 3, (y + 1) % 3];
        } else if (grid[(x + 1) % 3][(y + 2) % 3] == xory){
            return [(x + 2) % 3, (y + 1) % 3];
        } else {
            return false;
        }
    };
    const aiPlaceToken = (id) => {
        grid[id[0]][id[1]] = DisplayController.getPlayerTurn();
        renderBoard();
        if(checkWin( DisplayController.getPlayerTurn())){
            DisplayController.announceWin();
        };
        DisplayController.changeTurn();
    };
    const placeToken = (e) => {
        if(e.target.innerHTML == ""){
            grid[e.target.dataset.y][e.target.dataset.x] = DisplayController.getPlayerTurn();
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

    return{renderBoard, placeToken, resetBoard, toggleOverlay, aiPlaceToken, checkBlockOrWin};
})();

const DisplayController = (() => {
    const docXory = document.getElementById("xory");
    const resetBtn = document.getElementById("resetBtn");
    const aiBtn = document.getElementById("aiBtn");
    let aiGame = false;

    const setup = () => {
        Gameboard.resetBoard();
        Gameboard.renderBoard();
        playerAI.clearMemory();
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
    const askAI = (query, data) => {
        switch (query) {
            case "xmemory":
                return playerAI.queryMemory("X", data);
                break;
            case "omemory":
                return playerAI.queryMemory("O", data)
        }
    }

    //Make Player Objects
    const playerX = PlayerFactory("X");
    const playerO = PlayerFactory("O");
    const playerAI = aiFactory("O");

    //Initial Setup
    setup();
    return{changeTurn, announceWin, getPlayerTurn, askAI};
})();

// FUNCTIONS FOR AI
// DisplayController: aiTurn
// DisplayController: Check on changeTurn for pass to ai or not
// Player: isAI? Bool that will be checked.
// AI Play button to switch a player to AI
// AI button to change to 2 Player when hit (toggles)
// MAKE AI ALGORITHM....

