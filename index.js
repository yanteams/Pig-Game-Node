const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    let scores = [0, 0];
    let currentScore0 = 0;
    let currentScore1 = 0;
    let activePlayer = 0;
    let playing = true;

    socket.emit('updateGameData', {
        scores,
        currentScore0,
        currentScore1,
        activePlayer,
        playing,
    });

    socket.on('updateGameData', ({ scores, currentScore0, currentScore1, activePlayer, playing }) => {
        scores = scores;
        currentScore0 = currentScore0;
        currentScore1 = currentScore1;
        activePlayer = activePlayer;
        playing = playing;

        io.emit('updateGameData', {
            scores,
            currentScore0,
            currentScore1,
            activePlayer,
            playing,
        });
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});