const HEART = '♥';
const SKULL = '☠';

let btnClear;
let btnNext;
let btnRun;

let board;
const BOARD_SIZE = 10;
const CELL_SIZE = 48;
const BOARD = [];

const ALIVE_CELLS = [];
let runInterval;
let isRunning = false;

window.onload = () => {
    board = document.getElementById('board');
    for (let r = 0; r < BOARD_SIZE; r++) {
        let row = [];
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = document.createElement('div');
            cell.id = `${r}-${c}`;
            cell.innerText = SKULL;
            cell.addEventListener("mouseup", click);
            board.append(cell);
            row.push(cell);
        }

        BOARD.push(row);
    }

    btnClear = document.getElementById('clear-button');
    btnClear.addEventListener("click", clear);
    btnNext = document.getElementById('next-button');
    btnNext.addEventListener("click", next);
    btnRun = document.getElementById('run-button');
    btnRun.addEventListener("click", run);
}

function click() {
    const cell = this;
    if (ALIVE_CELLS.includes(cell)) {
        killCell(cell);
    } else {
        reviveCell(cell);
    }
}

clear = () => {
    clearInterval(runInterval);
    isRunning = false;
    ALIVE_CELLS.forEach((cell) => {
        cell.classList.remove('alive');
        cell.innerText = SKULL;
    });

    ALIVE_CELLS.splice(0, ALIVE_CELLS.length);
}

next = () => {
    if (ALIVE_CELLS.length === 0) {
        clearInterval(runInterval);
        isRunning = false;
    }

    const cellsToKill = [];
    const cellsToRevive = [];
    BOARD.forEach((row) => {
        row.forEach((cell) => {
            if (!ALIVE_CELLS.includes(cell)) {
                if (aliveNeighboors(cell) === 3) {
                    cellsToRevive.push(cell);
                }
            } else if (aliveNeighboors(cell) < 2 || aliveNeighboors(cell) > 3) {
                cellsToKill.push(cell);
            }
        });
    });

    cellsToRevive.forEach((cell) => {
        reviveCell(cell);
    });

    cellsToKill.forEach((cell) => {
        killCell(cell);
    });
}

aliveNeighboors = (cell) => {
    const row = Number(cell.id.substring(0, 1));
    const col = Number(cell.id.substring(2));
    let sum = 0;
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            if (c === 0 && r === 0) {
            } else if (BOARD[row + r] !== undefined) {
                if (ALIVE_CELLS.includes(BOARD[row + r][col + c])) {
                    sum++;
                }
            }
        }
    }

    return (sum);
}

reviveCell = (cell) => {
    ALIVE_CELLS.push(cell);
    cell.classList.add('alive');
    cell.innerText = HEART;
}

killCell = (cell) => {
    ALIVE_CELLS.splice(ALIVE_CELLS.indexOf(cell), 1);
    cell.classList.remove('alive');
    cell.innerText = SKULL;
}

run = () => {
    if (isRunning) {
        clearInterval(runInterval);
        isRunning = false;
    } else {
        runInterval = setInterval(next, 500);
        isRunning = true;
    }
}