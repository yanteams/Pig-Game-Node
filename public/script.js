"use strict";

const socket = io();

const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");

const diceEl = document.querySelector(".dice");

const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");

const score0El = document.getElementById("score--0");
const score1El = document.getElementById("score--1");
const current0El = document.getElementById("current--0");
const current1El = document.getElementById("current--1");

const diceMax = 6;
const addOne = 1;
const player0 = 0;
const player1 = 1;
const highestScore = 100;

let scores = [0, 0];
let currentScore0 = 0;
let currentScore1 = 0;
let activePlayer = 0;
let playing = true;

btnRoll.addEventListener("click", function () {
    if (playing) {
        const dice = Math.trunc(Math.random() * diceMax) + addOne;
        diceEl.classList.remove("hidden");
        diceEl.src = `dice-${dice}.png`;

        if (activePlayer === player0) {
            currentScore0 += dice;
            current0El.textContent = currentScore0;
        } else {
            currentScore1 += dice;
            current1El.textContent = currentScore1;
        }

        if (dice === 1) {
            switchActivePlayer();
        }

        socket.emit("updateGameData", {
            scores,
            currentScore0,
            currentScore1,
            activePlayer,
            playing,
        });
    }
});

btnHold.addEventListener("click", function () {
    if (playing) {
        if (activePlayer === player0) {
            scores[player0] += currentScore0;
            score0El.textContent = scores[player0];
            currentScore0 = 0;
            current0El.textContent = 0;
        } else {
            scores[player1] += currentScore1;
            score1El.textContent = scores[player1];
            currentScore1 = 0;
            current1El.textContent = 0;
        }

        if (scores[activePlayer] >= highestScore) {
            playing = false;
            diceEl.classList.add("hidden");
            document
                .querySelector(`.player--${activePlayer}`)
                .classList.add("player--winner");

            document
                .querySelector(`.player--${activePlayer}`)
                .classList.remove("player--active");
        } else {
            switchActivePlayer();
        }

        socket.emit("updateGameData", {
            scores,
            currentScore0,
            currentScore1,
            activePlayer,
            playing,
        });
    }
});

function switchActivePlayer() {
    if (activePlayer === player0) {
        currentScore0 = 0;
        current0El.textContent = 0;
    } else {
        currentScore1 = 0;
        current1El.textContent = 0;
    }

    activePlayer = activePlayer === player0 ? player1 : player0;
    player0El.classList.toggle("player--active");
    player1El.classList.toggle("player--active");

    if (activePlayer === player0) {
        current0El.textContent = currentScore0;
    } else {
        current1El.textContent = currentScore1;
    }
}

const initialize = function () {
    scores = [0, 0];
    currentScore0 = 0;
    currentScore1 = 0;
    activePlayer = 0;
    playing = true;

    current0El.textContent = 0;
    current1El.textContent = 0;
    score0El.textContent = 0;
    score1El.textContent = 0;
    diceEl.classList.add("hidden");
    player0El.classList.remove("player--winner");
    player1El.classList.remove("player--winner");
    player0El.classList.add("player--active");
    player1El.classList.remove("player--active");
    socket.emit("updateGameData", {
        scores,
        currentScore0,
        currentScore1,
        activePlayer,
        playing,
    });
};

initialize();

btnNew.addEventListener("click", initialize);

socket.on("updateGameData", ({ scores, currentScore0, currentScore1, activePlayer, playing }) => {
    this.scores = scores;
    this.currentScore0 = currentScore0;
    this.currentScore1 = currentScore1;
    this.activePlayer = activePlayer;
    this.playing = playing;

    score0El.textContent = this.scores[0];
    score1El.textContent = this.scores[1];

    if (activePlayer === player0) {
        current0El.textContent = this.currentScore0;
        current1El.textContent = this.currentScore1;
        player0El.classList.add("player--active");
        player1El.classList.remove("player--active");
    } else {
        current1El.textContent = this.currentScore1;
        current0El.textContent = this.currentScore0;
        player1El.classList.add("player--active");
        player0El.classList.remove("player--active");
    }
});