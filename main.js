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
    let firstTurn = "";
    let secondTurn = "";

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
    //primarily a debugging tool
    const queryAllMemory = () => {
        return {oMemory, xMemory};
    };
    const playEdge = () =>{
        let max = 4;
        let edges = [[0,1][1,0][1,2][2,1]]
        Gameboard.aiPlaceToken(edges[Math.floor(Math.random() * Math.floor(max))])
    };
    const playCorner = () =>{
        let max = 4;
        let corners = [[0,0][0,2][2,0][2,2]]
        Gameboard.aiPlaceToken(corners[Math.floor(Math.random() * Math.floor(max))])
    };
    const playMiddle = () =>{
        Gameboard.aiPlaceToken([1,1]);
    }
    const makeDecision = () => {
        let blockWhere = [];
        let winWhere = [];
  

        //Check first if a win is acheivable
        if(winWhere = Gameboard.checkBlockOrWin("O")){
            console.log("I Played" + winWhere[0] + ", " + winWhere[1] + " for the win!");
            Gameboard.aiPlaceToken(winWhere);
            return;
        }

        //Check next if a block is needed to survive
        if(blockWhere = Gameboard.checkBlockOrWin("X")){
            console.log("I Blocked " + blockWhere[0] + ", " + blockWhere[1])
            oMemory.push([blockWhere[0],blockWhere[1]]);
            Gameboard.aiPlaceToken(blockWhere);
        };
        
        switch (Gameboard.getTurnCount()){
            case 1:
                //first turn
                if(Gameboard.queryBoard() == "corner"){
                    //Human played Corner First, so ai goes middle.
                    firstTurn = "corner"
                    playMiddle();
                } else if(Gameboard.queryBoard() == "middle"){
                    //Human played Middle First so ai plays random corner
                    firstTurn = "middle"
                    playCorner();
                } else {
                    //Human played edge
                    firstTurn = "edge"
                    playMiddle();
                }
                break;
            case 2:
                //second turn
                if(firstTurn = "corner" && Gameboard.queryBoard() == "corner"){
                    //Human played Corner First, so ai goes middle.
                    secondTurn = "corner"
                    playEdge();
                } else if(Gameboard.queryBoard() == "middle"){
                    //Human played Middle First so ai plays random corner
                    firstTurn = "middle"
                    playCorner();
                } else {
                    //Human played edge
                    firstTurn = "edge"
                    playCorner();
                }
                break;
        }

    };
    return {toggleTurn, getTurn, makeDecision, queryMemory, clearMemory, queryAllMemory};
}

const Gameboard = (() => {
    let grid = [["","",""],["","",""],["","",""]];
    let cells = document.querySelectorAll(".cell");
    let overlay = document.getElementById("winOverlay");
    let turnCounter = 0;

    const classifyCell = (y, x) => {
        let cell = {};
        if(y == 1 && x == 1){
            cell.class = "middle";
        } else if(y == 1 || x == 1){
            cell.class = "edge";
        } else {
            cell.class = "corner";
            if(y == 0 && x == 0 || y == 2 && x == 2){
                //Left Up Right Down
                cell.type = "LURD";
            } else {
                //Left Down Right Up
                cell.type = "LDRU";
            }
        }
        return cell;
    };
    const toggleOverlay = (toggle, winner) => {
        overlay.style.display = toggle ? "block" : "none";
        if(winner == "Draw"){
            overlay.firstElementChild.innerHTML = `Its a Draw!`;
        } else {
            overlay.firstElementChild.innerHTML = `${winner} Wins the game!`;
        }
    };
    const renderBoard = () => {
        cells.forEach(cell =>{
            cell.innerHTML = grid[cell.dataset.y][cell.dataset.x];
        });
    };
    const queryBoard = () =>{
        for(let i=0;i<grid.length;i++){
            for(let j=0;j<grid[i].length;j++){
                if(grid[i][j] == "X"){
                    return classifyCell(grid[i],grid[j]).class;
                }
            }
        }
    };
    const checkBlockOrWin = (xory) => {
        //This should see if X needs blocking or AI can win.
        let locations = [];
        let requiredMove = false;
        //Cycle through grid to find locations player or ai has played.
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
            if(requiredMove && checkSpace(requiredMove)){
                break;
            }
            requiredMove = false;
        }
        return requiredMove;
    };
    const checkNeighbours = (y, x, xory) => {
        let cellType = classifyCell(y, x);
        //Check Up Down Left Right and diagonals
        //only checks diagonals for corners and middle

        if (grid[(y + 1) % 3][x] == xory){
            return [(y + 2) % 3, x];
        } else if (grid[(y + 2) % 3][x] == xory){
            return [(y + 1) % 3, x];
        } else if (grid[y][(x + 1) % 3] == xory){
            return [y, (x + 2) % 3];
        } else if (grid[y][(x + 2) % 3] == xory){
            return [y, (x + 1) % 3];
        } else if (cellType.class != "edge" && cellType.type != "LDRU" && grid[(y + 1) % 3][(x + 1) % 3] == xory){
            return [(y + 2) % 3, (x + 2) % 3];
        } else if (cellType.class != "edge" && cellType.type != "LDRU" && grid[(y + 2) % 3][(x + 2) % 3] == xory){
            return [(y + 1) % 3, (x + 1) % 3];
        } else if (cellType.class != "edge" && cellType.type != "LURD" && grid[(y + 1) % 3][(x + 2) % 3] == xory){
            return [(y + 2) % 3, (x + 1) % 3];
        } else if (cellType.class != "edge" && cellType.type != "LURD" && grid[(y + 2) % 3][(x + 1) % 3] == xory){
            return [(y + 1) % 3, (x + 2) % 3];
        } else {
            return false;
        }
    };
    const aiPlaceToken = (id) => {
        grid[id[0]][id[1]] = DisplayController.getPlayerTurn();
        renderBoard();
        turnCounter++;
        if(checkWin( DisplayController.getPlayerTurn())){
            DisplayController.announceWin();
        };
        DisplayController.changeTurn();
    };
    const placeToken = (e) => {
        if(e.target.innerHTML == ""){
            grid[e.target.dataset.y][e.target.dataset.x] = DisplayController.getPlayerTurn();
            renderBoard();
            turnCounter++
            if(checkWin( DisplayController.getPlayerTurn())){
                DisplayController.announceWin();
            };
            DisplayController.changeTurn();
        } else {
            console.log("something exists here already")
        };
    };
    const checkSpace = (id) => {
        //Is space occupied?
        if(grid[id[0]][id[1]] == ""){
            return true;
        } else {
            return false;
        }
    };
    const resetBoard = () => {
        grid = [["","",""],["","",""],["","",""]];
        toggleOverlay(false, "Noone")
        turnCounter = 0;
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
        if(turnCounter == 9){
            gameOver = true;
        }
        return gameOver == true ? true : false;
    };
    const getTurnCount = () => {
        return turnCounter;
    }

    return{renderBoard, placeToken, resetBoard, toggleOverlay, aiPlaceToken, checkBlockOrWin, getTurnCount, queryBoard};
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
        if(Gameboard.getTurnCount() == 9){
            Gameboard.toggleOverlay(true, "Draw")
        } else {
            Gameboard.toggleOverlay(true, getPlayerTurn());
        }
    };
    const getPlayerTurn = () => {
        return playerX.getTurn() == true ? "X" : "O";
    };
    const makeAiGame = () => {
        aiGame = true;
        Gameboard.resetBoard();
        // add button switch
    };
    const askAI = (query, data) => {
        switch (query) {
            case "xmemory":
                return playerAI.queryMemory("X", data);
                break;
            case "omemory":
                return playerAI.queryMemory("O", data)
                break;
            case "memory":
                //this is just for debug
                return playerAI.queryAllMemory();
                break;
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


