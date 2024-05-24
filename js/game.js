'use strict'

const MINE = '✷'
const EMPTY = ''
const FLAG = '🚩'
const NORMAL = '❀'
const WIN = '♛'
const LOSE = '☹'


var gLives
var gBoard
var gLevel
var gGame

var gStartTime
var gTimerInterval


function onInit() {
    resetTimer()

    document.querySelector(`.reset-btn`).innerHTML = NORMAL
    document.querySelector('h2').style.color = 'transparent'

    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
    }
    gBoard = createBoard(4, 4, 2)
    gLevel = { size: 16, mines: 2 }
    gLives = { lives: '❤︎', livesCount: 1 }

    renderBoard(gBoard)

}

function selectBoard(difficulty) {

    var board
    var level
    var lives

    if (difficulty === 'beginner') {
        board = createBoard(4, 4, 2)
        level = { size: 16, mines: 2 }
        lives = { livesCount: 1, lives: '❤︎' }
    }
    if (difficulty === 'medium') {
        board = createBoard(8, 8, 14)
        level = { size: 64, mines: 14 }
        lives = { livesCount: 2, lives: '❤︎❤︎' }
    }
    if (difficulty === 'expert') {
        board = createBoard(12, 12, 32)
        level = { size: 144, mines: 32 }
        lives = { livesCount: 3, lives: '❤︎❤︎❤︎' }
    }

    gBoard = board
    gLevel = level
    gLives = lives
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
    }

    document.querySelector('h2').style.color = 'transparent'
    document.querySelector(`.reset-btn`).innerHTML = NORMAL
    renderBoard(gBoard)

}

function createBoard(rows, cols, minesNum) {

    resetTimer()
    gGame.isOn = true
    gGame.shownCount = 0
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

    for (var i = 0; i < nums; i++) {
        var row = Math.floor(getRandomIntInclusive(0, rows - 1))
        var col = Math.floor(getRandomIntInclusive(0, cols - 1))
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
            var className = `cell cell-${i}-${j}`
            if (board[i][j].isMine === true) {
                cell = MINE
                className = `cell cell-${i}-${j} mine`
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
    renderLives()
}

function hideCells(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = document.querySelector(`.cell-${i}-${j}`)
            currCell.classList.add('hidden')
        }
    }
}

function renderLives() {

    var elLives = document.querySelector('.lives')
    elLives.innerHTML = gLives.lives

}

function onCellClicked(i, j) {
    
    if (!gGame.isOn) return
    if (gGame.shownCount === 0) {
        resetTimer()
        startTimer()
    }

    var cellClicked = document.querySelector(`.cell-${i}-${j}`)
    if (cellClicked.classList.contains('marked')) return
    if (gBoard[i][j].isShown) return

    cellClicked.classList.remove('hidden')
    gGame.shownCount++
    gBoard[i][j].isShown = true

    if (gBoard[i][j].isMine === true) {
        decreaseLives()
        if (gLives.livesCount === 0) gameOver(false)
    }
    if (gBoard[i][j].minesAroundCount === 0) {
        showNegs(i, j)
    }

    if (checkWin()) gameOver(true)
}

function decreaseLives() {

    gLives.livesCount--
    gLives.lives = ''
    for (var i = 0; i < gLives.livesCount; i++) {
        gLives.lives += '❤︎'
    }
    var elLives = document.querySelector('.lives')
    elLives.innerHTML = gLives.lives
}

function showNegs(cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (gBoard[i][j].isShown) continue
            var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            if (elCurrCell.classList.contains('hidden')) {
                gBoard[i][j].isShown = true
                elCurrCell.classList.remove('hidden')
                gGame.shownCount++
                if (elCurrCell.innerHTML === FLAG) {
                    if (gBoard[i][j].minesAroundCount === 0) {
                        elCurrCell.innerHTML = EMPTY
                    }
                    else {
                        elCurrCell.innerHTML = gBoard[i][j].minesAroundCount
                    }
                }
                if (gBoard[i][j].minesAroundCount === 0) showNegs(i, j)
            }
        }
    }
}

function markCell(event, i, j) {

    event.preventDefault()
    if (!gGame.isOn) return

    var cellMarked = document.querySelector(`.cell-${i}-${j}`)
    var cellMarkedContent = cellMarked.innerHTML
    if (cellMarked.classList.contains('hidden')) {
        var originalCellContent = cellMarkedContent
        if (cellMarked.classList.contains('marked')) {
            cellMarked.innerHTML = originalCellContent
            cellMarked.classList.remove('marked')
            cellMarked.style.color = 'transparent'
            gGame.markedCount--
        } else {
            cellMarked.innerHTML = FLAG
            cellMarked.classList.add('marked')
            cellMarked.style.color = 'white'
            gGame.markedCount++
            if (checkWin()) gameOver(true)
        }
    }
}

function gameOver(isWinner) {

    gGame.isOn = false
    stopTimer()
    document.querySelector('h2').style.color = 'rgb(247, 159, 174)'
    if (!isWinner) {
        showMines()
        document.querySelector(`.reset-btn`).innerHTML = LOSE
    } else {
        document.querySelector(`.reset-btn`).innerHTML = WIN
    }
}

function showMines() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = document.querySelector(`.cell-${i}-${j}`)
            if (gBoard[i][j].isMine === true)
                currCell.classList.remove('hidden')
        }
    }
}

function checkWin() {

    if (gGame.shownCount === gLevel.size - gLevel.mines &&
        gGame.markedCount === gLevel.mines)
        return true
}
