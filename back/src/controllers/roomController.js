//Importálások
const { v4 } = require("uuid");
const { Room } = require('../models/Room');
const { Rooms } = require('../models/Room');
const { genereateCode } = require('../utils/codeGenerator');

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
        res.status(200).send({
            message: "Room found",
            room: room,
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
    var room = new Room(v4(), socketId, code, quizId);
    rooms.addRoom(room);
    res.status(200).send({
        message: "Room created",
    });
}

module.exports = {
    getRooms,
    getRoom,
    createRoom,
};