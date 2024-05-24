'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function createMat(ROWS, COLS) {

    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push({})
        }
        mat.push(row)
    }
    return mat
}

function NegsCount(cellI, cellJ, board) {

    var count = 0

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isMine === true) count++;
        }
    }
    return count
}

function resetTimer() {
    clearInterval(gTimerInterval)
    var elSpan = document.querySelector('.timer')
    elSpan.innerText = '0'
}

function stopTimer() {
    clearInterval(gTimerInterval);
    var elapsedTime = ((Date.now() - gStartTime) / 1000).toFixed(1);
    var elSpan = document.querySelector('.timer');
    elSpan.innerText = elapsedTime;
}

function startTimer() {
    gStartTime = Date.now()
    gTimerInterval = setInterval(() => {
        var seconds = ((Date.now() - gStartTime) / 1000).toFixed(1);
        var elSpan = document.querySelector('.timer');
        elSpan.innerText = seconds
    }, 100);
}