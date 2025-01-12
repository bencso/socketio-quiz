//Importálások
const { v4 } = require("uuid");
const { Room } = require('../models/Room');
const { Rooms } = require('../models/Room');
const { genereateCode } = require('../utils/codeGenerator');
const connection = require('../config/db');
const logger = require('../config/logger');

// Szoba deklarálása
//? Ez azért lesz, hogy a szobákat le tudjuk tárolni, ezeket a szobákat
//? osztályként tároljuk le, hogy könnyen tudjuk kezelni őket.
let rooms = new Rooms();

//? GET /api/rooms - itt az összes szobát tudjuk lekérni.
const getRooms = (_, res) => {
    res.status(200).send({
        message: "Rooms found",
        rooms: rooms.getRooms(),
    });
}

//? GET /api/room/:code - itt egy szobát lehet lekérni CODE-ja alapján.
const getRoom = (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    const room = rooms.getRoom(code);
    if (room) {
        room.addPlayer(req.body.socketId);
        res.status(200).send({
            room_id: room.getId(),
            code: room.getCode(),
            players: room.getPlayers(),
        });
    } else {
        res.status(404).send({
            message: "Room not found",
        });
    }
}

//? POST /api/c/room/:quizId - itt szobát tudunk létrehozni.
//? A quizId-t paraméterként kapjuk meg, míg a socketId-t a bodyból.
//TODO: A kérdéseket le kell kérni majd a quizId alapján.
const createRoom = (req, res) => {
    const quizId = req.params.quizId;
    const socketId = req.body.socketId;
    const code = genereateCode();
    var room = new Room(v4(), socketId, code);
    rooms.addRoom(room);
    //? MIKET ADJUNK MEG TOVÁBB?
    let sql = `
    SELECT questions.question_id
    FROM questions NATURAL JOIN answer NATURAL JOIN quiz 
    WHERE quiz.quiz_id = ? 
    GROUP BY questions.question_id;`;
    connection.query(sql, [quizId], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: "Internal server error",
            });
        } else {
            room.addPlayer(socketId);
            results.forEach((result) => room.addQuestion(result.question_id));
            res.status(200).send({
                room_id: room.getId(),
                code: room.getCode(),
                questionsId: room.getQuestions(),
            });
        }
    });
}


module.exports = {
    getRooms,
    getRoom,
    createRoom,
};