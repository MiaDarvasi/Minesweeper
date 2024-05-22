'use strict'

const MINE = '💥'
const EMPTY = ''


var gBoard // [{minesAroundCount: , isShown: , isMine: , isMarked:},{},{}}
var gLevel // {size: , mines:}
var gGame // {isOn: , shownCount: , markedCount: , secsPassed:}


function onInit() {

    gBoard = createBoard()
    setMinesNegsCount()
    renderBoard(gBoard)
    hideCells(gBoard)

}

function createBoard() {

    var board = createMat(4, 4)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    board = addMines(board)
    return board
}

function addMines(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (i === 0 && j === 1 || i === 2 && j === 3)
                board[i][j].isMine = true
        }
    }
    return board
}

function renderBoard() {

    var strHTML = ''

    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {

            var cell
            const className = `cell cell-${i}-${j}`
            if (gBoard[i][j].isMine === true) {
                cell = MINE
            } else {
                if (gBoard[i][j].minesAroundCount === 0) {
                    cell = EMPTY
                } else {
                    cell = gBoard[i][j].minesAroundCount
                }
            }

            strHTML += `<td class="${className}" onclick="onCellClicked(${i},${j})">${cell}</td>`
        }
        strHTML += '</tr>'
    }

    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function hideCells(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = document.querySelector(`.cell-${i}-${j}`)
            currCell.classList.add('hidden')
        }
    }
}

function onCellClicked(i, j) {

    var cellClicked = document.querySelector(`.cell-${i}-${j}`)
    cellClicked.classList.remove('hidden')
    gBoard[i][j].isShown = true
    if (cellClicked.innerHTML === MINE) return
    if (gBoard[i][j].minesAroundCount === 0) {
        showNegs(i, j, gBoard)
    }

}

function showNegs(cellI, cellJ, board) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var currCell = document.querySelector(`.cell-${i}-${j}`)
            currCell.classList.remove('hidden')
        }
    }

}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j].minesAroundCount = NegsCount(i, j, gBoard)
        }
    }
}


