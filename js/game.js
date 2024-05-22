'use strict'

const MINE = '💥'
const EMPTY = ''
const FLAG = '🚩'


var gBoard // [{minesAroundCount: , isShown: , isMine: , isMarked:},{},{}}
var gLevel // {size: , mines:}
var gGame // {isOn: , shownCount: , markedCount: , secsPassed:}


function onInit() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
    }

    gBoard = createBoard(4, 4, 2)
    renderBoard(gBoard)

}

function selectBoard(difficulty) {
    if (difficulty === 'beginner') {
        var board = createBoard(4, 4, 2)
    }
    if (difficulty === 'medium') {
        board = createBoard(8, 8, 14)
    }
    if (difficulty === 'expert') {
        board = createBoard(12, 12, 32)
    }
    gBoard = board
    renderBoard(gBoard)

}

function createBoard(rows, cols, minesNum) {

    var board = createMat(rows, cols)

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
    addMines(rows, cols, minesNum, board)
    setMinesNegsCount(board)
    return board
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = NegsCount(i, j, board)
        }
    }
}

function addMines(rows, cols, nums, board) {
    // console.log('rows:', rows, 'cols:', cols, 'nums:', nums)
    // console.table('board:', board)
    for (var i = 0; i < nums; i++) {
        var row = Math.floor(getRandomIntInclusive(0, rows))
        var col = Math.floor(getRandomIntInclusive(0, cols))
        // console.log(row, board[1])
        board[row][col].isMine = true
    }
    return board
}

function renderBoard(board) {

    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            var cell
            const className = `cell cell-${i}-${j}`
            if (board[i][j].isMine === true) {
                cell = MINE
            } else {
                if (board[i][j].minesAroundCount === 0) {
                    cell = EMPTY
                } else {
                    cell = board[i][j].minesAroundCount
                }
            }

            strHTML += `<td class="${className}" 
            onclick="onCellClicked(${i},${j})" 
            oncontextmenu="markCell(event,${i},${j})">${cell}
            </td>`
        }
        strHTML += '</tr>'
    }

    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML

    hideCells(board)
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

    if (cellClicked.classList.contains('marked')) return
    cellClicked.classList.remove('hidden')
    gBoard[i][j].isShown = true
    // gGame.shownCount++
    if (cellClicked.innerHTML === MINE) return gameOver(false)
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
            // gGame.shownCount++
        }
    }

}

function markCell(event, i, j) {
    event.preventDefault()
    var cellMarked = document.querySelector(`.cell-${i}-${j}`)
    var cellMarkedContent = cellMarked.innerHTML
    if (cellMarked.classList.contains('hidden')) {
        if (cellMarked.classList.contains('marked')) {
            cellMarked.innerHTML = originalCellContent
            cellMarked.classList.remove('marked')
            cellMarked.style.color = 'transparent'
        } else {
            var originalCellContent = cellMarkedContent
            cellMarked.innerHTML = FLAG
            cellMarked.classList.add('marked')
            cellMarked.style.color = 'black'
        }
    }
}

function gameOver(isWinner) {
    if (!isWinner) {
        console.log('game over')
        showMines()
    }

}

function showMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = document.querySelector(`.cell-${i}-${j}`)
            if (currCell.innerHTML === MINE)
                currCell.classList.remove('hidden')
        }
    }
}