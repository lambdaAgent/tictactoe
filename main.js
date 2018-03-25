
function main(){
    const renderState_mainBoard = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    const gameElem = document.querySelector('#game');
    const modalContainer = document.querySelector('#modalContainer');
    modalContainer.style.display = 'none';
    gameElem.innerHTML = '';

    const turn = 'X'; // X | O
    const playerChecker = 'X';
    const compChecker = 'O';

    const nextTurn = endTurn(
        {playerChecker, compChecker, 
        renderState_mainBoard, endGame, renderBoard
       })
    renderBoard(turn)(
        {compChecker, playerChecker,
         renderState_mainBoard, endGame, nextTurn
        }
    );

}


const renderBoard = (turn) => ({playerChecker, compChecker, 
    renderState_mainBoard: mainBoard, nextTurn, endGame
   }) => {
    const gameElem = document.getElementById('game');
   
    [0,1,2].forEach(columnIndex => {
        const div = document.createElement('div');
        div.className = 'row';
        [0,1,2].forEach(rowIndex => {
            const span = document.createElement('span');
            span.className = 'cell';
            const index = [columnIndex, rowIndex];
            span.id = index;
            span.onclick = function(spanElem, e){
                if(span.innerHTML) return;
                span.innerHTML = turn;
                mainBoard[columnIndex][rowIndex] = turn;
                const [isWon, availableSteps] = checkForWinner(mainBoard);
                turn = turn === 'X' ? 'O' : 'X';
                if(availableSteps.length === 0 && !isWon){
                    tieGame();
                }
                else if(!isWon){
                    // end turn and next player
                    nextTurn(availableSteps, spanElem, turn);     
                } else {
                    // we have a winner, tell the game state to run endgame
                    const whoIsWinner = isWon === playerChecker ? 'PLAYER' : 'COMPUTER'
                    endGame(whoIsWinner)
                }
            }.bind(this, span)
            div.appendChild(span);
        });
        gameElem.appendChild(div);
    });
}

function checkForWinner( mainBoard){
    let winner;
    const winConditions = [
        [0,0], [1,0], [2,0], // -> 0,2
        [0,1], [1,1], [2,1], // -> 4,6
        [0,2], [1,2], [2,2], // -> 7,9
        [0,0], [0,1], [0,2],
        [1,0], [1,1], [1,2],
        [2,0], [2,1], [2,2],
        [0,2], [1,1], [2,0],
        [0,0], [1,1], [2,2]
    ];

    const availableSteps = [];
    mainBoard.forEach((column, columnIndex) => {
        column.forEach((value, rowIndex) => {
            if(value === 0) availableSteps.push([columnIndex, rowIndex]);
        });
    });

    for(let i=0; i<winConditions.length; i+=3){
        const checks = [winConditions[i], winConditions[i+1], winConditions[i+2]];
        const result = checks.map(([y,x]) => {
            return mainBoard[y][x]
        });
        console.log(result);
        const newResult = Array.from(new Set(result));
        console.log(newResult);
        if(newResult.length > 1){
            continue;
        } else if(newResult[0] === 0){
            continue;
        }

        // else  we have a winner;
        winner = newResult[0];
        break;
    }
    console.log('')


    return [winner, availableSteps];
}


const endTurn = ({playerChecker, compChecker, 
    renderState_mainBoard: mainBoard
   }) => {
    return function nextTurn(availableSteps, spanElem, turn){
        // render the cell with checker
        // end turn and pass to computer
        if(turn === compChecker){
            // run logic
            const [y,x] = computerLogic(availableSteps, mainBoard, turn);
            mainBoard[y][x] = compChecker;
            document.getElementById(`${y},${x}`).click();
        }
    }
};



const endGame = (whoIsWinner ) => {
    const modalContainer = document.querySelector('#modalContainer');
    const winner = document.querySelector('#winner');
    modalContainer.style.display = 'flex';
    winner.innerHTML = whoIsWinner
}


function computerLogic(availableSteps, mainBoard, turn){
    
    const pickedStep = Math.floor(Math.random() * availableSteps.length);
    return availableSteps[pickedStep];
}

const tieGame = () => {
    const modalContainer = document.querySelector('#modalContainer');
    const modal = document.querySelector('#modal');
    modal.innerHTML = `
    The Game is Tie
    <button onclick="main()">Continue</button>
    `;
    modalContainer.style.display = 'flex';
};