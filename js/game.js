'use strict'

const MINE = '✷'
const EMPTY = ''
const FLAG = '🚩'
const NORMAL = '❀'
const WIN = '♛'
const LOSE = '☠︎︎'
const HINT = '𖦹'

var gLives
var gBoard
var gLevel
var gGame
var gHintsCount

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
    gHintsCount = 3

    renderBoard(gBoard)
}

function onSelectBoard(difficulty) {

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
    gHintsCount = 3
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

function addMines(rows, cols, nums, board) {

    var minesAdded = 0
    while (minesAdded < nums) {
        var row = Math.floor(getRandomIntInclusive(0, rows - 1))
        var col = Math.floor(getRandomIntInclusive(0, cols - 1))
        var mineLocation = board[row][col]
        if (!mineLocation.isMine) {
            mineLocation.isMine = true
            minesAdded++
        }
    }
    return board
}

function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = NegsCount(i, j, board)
        }
    }
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
    renderHints()
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

function renderHints() {

    var strHTML = ''
    for (var i = 0; i < gHintsCount; i++) {
        strHTML += `<button class="hint-btn num${i}" onclick="hintMode(${i})">${HINT}</button>`
    }
    document.querySelector(`.hints-symbl`).innerHTML = strHTML
}

function hintMode(i) {
    var elHint = document.querySelector(`.num${i}`)
    if (elHint.classList.contains('hint-mode')) {
        elHint.classList.remove('hint-mode')
        renderHints()
    } else {
        elHint.classList.add('hint-mode')
    }
}

function showHint(cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            if (elCurrCell.classList.contains('hidden')) {
                elCurrCell.classList.remove('hidden')
                elCurrCell.classList.add('was-hidden')
            }
        }
    }
}

function hideHint() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            if (elCurrCell.classList.contains('was-hidden')) {
                elCurrCell.classList.add('hidden')
                elCurrCell.classList.remove('was-hidden')
            }
        }
    }
}

function onCellClicked(i, j) {

    if (!gGame.isOn) return
    if (gGame.shownCount === 0) {
        resetTimer()
        startTimer()
    }

    var elHint = document.querySelector('.hint-btn')
    if (elHint.classList.contains(`hint-mode`)) {
        elHint.classList.remove(`hint-mode`)
        showHint(i, j)
        setTimeout(hideHint, 1000)
        gHintsCount--
        renderHints()
    } else {
        var cellClicked = document.querySelector(`.cell-${i}-${j}`)
        if (cellClicked.classList.contains('marked')) return
        if (gBoard[i][j].isShown) return

        cellClicked.classList.remove('hidden')
        gBoard[i][j].isShown = true
        gGame.shownCount++

        if (gBoard[i][j].isMine === true) {
            decreaseLives()
            if (gLives.livesCount === 0) gameOver(false)
            gGame.markedCount++
            gGame.shownCount--
        } else if (gBoard[i][j].minesAroundCount === 0) {
            showNegs(i, j)
        }

        if (checkWin()) gameOver(true)
    }
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

function onDarkMode() {
    var elBody = document.querySelector('body')
    var elBtn = document.querySelector('.view-mode')
    if (elBody.classList.contains('dark-mode')) {
        elBody.classList.remove('dark-mode')
        elBtn.innerHTML = 'Dark Mode'
    } else {
        elBody.classList.add('dark-mode')
        elBtn.innerHTML = 'Light Mode'
    }
}

