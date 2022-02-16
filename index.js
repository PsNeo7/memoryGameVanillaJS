const gameBoardELe = document.querySelector("#game-board");
const scoreEle = document.querySelector("#score");
const highScoreEle = document.querySelector("#high-score");
const startBtn = document.querySelector("#start");

let round = 0;

const getHighScore = () => {
    if (localStorage.getItem('highScore')) {
        return localStorage.getItem('highScore')
    }
    return 0
}

let highScore = getHighScore()

const squares = 5;

let roundObjRef = {
    roundState: "NOT_STARTED",
    curentRound: 1,
    sequence: [],
    currentSequenceIndex: 0
}

let roundObj = {
    roundState: "NOT_STARTED",
    curentRound: 1,
    sequence: [],
    currentSequenceIndex: 0
}

const initBoard = (squares = 5) => {
    gameBoardELe.innerHTML = ``
    for (let index = 0; index < squares; index++) {
        gameBoardELe.innerHTML += getTile(index)
    }
}

const getTile = (id) => {
    return `<div class="tile" data-type="tile" id="${id}"></div>`
}

const setScore = (score) => {
    scoreEle.innerHTML = score
    setHighScore(score)
    setHighScoreEle(highScore)
}

const setHighScoreEle = (score) => {
    highScoreEle.innerHTML = score
}

const startRound = (currentRound = 1, squares = 5) => {
    roundObj.sequence = getRandomNumbers(0, squares, currentRound)
    // roundObj.
    console.log("starting round");
    console.log(roundObj.sequence);
    roundObj.roundState = "SHOWING_SEQUENCE"
    showSequence(roundObj.sequence)
    roundObj.roundState = "STARTED"
}

const showSequence = (sequence = []) => {
    sequence.forEach((element, index) => {
        setTimeout(() => {
            lightUpSquare(element)
        }, 1000 * index);
    });
    setTimeout(() => {
        freeStartButton()
    }, 1000 * sequence.length);
}

const freeStartButton = () => {
    console.log("freeing grid");
    gameBoardELe.style.pointerEvents = "auto"
    startBtn.disabled = false
}

const freezeStartButton = () => {
    console.log("freezing grid");
    gameBoardELe.style.pointerEvents = "none"
    startBtn.disabled = true
}

const lightUpSquare = (id, color = "blue") => {
    let tile = document.getElementById(id)
    tile.style.backgroundColor = color
    setTimeout(() => {
        tile.style.backgroundColor = "lightgrey"
    }, 500);
}

const endGame = () => {
    roundObj = Object.create(roundObjRef)
    setScore(roundObj.curentRound - 1)
    gameBoardELe.classList.add("shake")
    setTimeout(() => {
        gameBoardELe.classList.remove("shake")
    }, 800);
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const getRandomNumbers = (min, max, count) => {
    let numbers = []
    for (let index = 0; index < count; index++) {
        numbers.push(getRandomInt(min, max))
    }
    return numbers
}

startBtn.addEventListener("click", () => {
    // startRound(roundObj)
    if (roundObj.roundState === "STARTED") {
        showSequence(roundObj.sequence)
    }
    else {
        console.log("trying to start");
        startRound(roundObj.curentRound)
    }

})

gameBoardELe.addEventListener("click", (e) => {
    if (e.target.dataset.type === "tile") {
        checkSequence(e.target.id)
    }
})

const checkSequence = (id) => {
    // id = Number(id)
    if (roundObj.roundState === "STARTED") {
        console.log(id, roundObj.sequence[roundObj.currentSequenceIndex]);
        if (id == roundObj.sequence[roundObj.currentSequenceIndex]) {
            lightUpSquare(id)
            console.log("correct");
            if (roundObj.currentSequenceIndex < roundObj.sequence.length) {
                roundObj.currentSequenceIndex += 1
            }
            if (roundObj.currentSequenceIndex === roundObj.sequence.length) {
                roundObj.currentSequenceIndex = 0
                roundObj.curentRound++
                setScore(roundObj.curentRound - 1)
                roundObj.roundState === "SUCCESS"
                freezeStartButton()
                setTimeout(() => {
                    freeStartButton
                    startRound(roundObj.curentRound)
                }, 1000);
            }
        } else {
            lightUpSquare(id, "red")
            endGame()
            console.log("incorrect");
        }
    }
}

const setHighScore = (score) => {
    console.log("tring to set high score: ", score, getHighScore());
    if (Number(score) > Number(getHighScore())) {
        highScore = score
        localStorage.setItem('highScore', score)
    }
}

setScore(round)

initBoard(squares)
// startRound(1, squares, round)
