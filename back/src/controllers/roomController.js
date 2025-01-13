//Importálások
const { v4 } = require("uuid");
const { Room } = require("../models/Room");
const { Rooms } = require("../models/Room");
const { genereateCode } = require("../utils/codeGenerator");
const connection = require("../config/db");
const logger = require("../config/logger");

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
};

//? POST /api/join/:code - itt egy szobába lehet csatlakozni, CODE alapján.
// @params code
// @body socketId
const joinRoom = (req, res) => {
  let code = req.params.code;
  let socketId = req.body.socketId;
  code = code.toUpperCase();
  const room = rooms.getRoom(code);
  if (room) {
    room.addPlayer(socketId);
    res.status(200).send({
      roomId: room.getId(),
      code: room.getCode(),
      players: room.getPlayers(),
    });
  } else {
    res.status(404).send({
      message: "Room not found",
    });
  }
};

//? POST /api/c/room/:quizId - itt szobát tudunk létrehozni.
//? A quizId-t paraméterként kapjuk meg, míg a socketId-t a bodyból.
//TODO: A kérdéseket le kell kérni majd a quizId alapján.
// @params quizId
// @body socketId
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
      logger.debug(socketId);
      room.addPlayer(socketId);
      logger.debug(room);
      res.status(200).send({
        roomId: room.getId(),
        code: room.getCode(),
        questionsId: room.getQuestion(),
        players: room.getPlayers(),
      });
    }
  });
};

//? POST /api/l/room/:code - itt lehet kilépni a szobából.
// @params code 
// @body socketId
const leaveRoom = (req, res) => {
  let socketId = req.body.socketId;
  let room = rooms.getRoomsByPlayer(socketId);
  if (room) {
    room.removePlayer(socketId);
    if (room.getPlayers().length === 0) {
      rooms.removeRoom(room);
      res.status(200).send({
        message: "Room deleted",
      });
    } else {
      res.status(200).send({
        message: "Player left",
        players: room.getPlayers(),
      });
    }
  } else {
    res.status(404).send({
      message: "Room not found",
    });
  }
};

//----
const getRoom = (req,res) => {
  let code = req.params.code;
  const room = rooms.getRoom(code);
  if (room) {
    res.status(200).send({
      roomId: room.getId(),
      code: room.getCode(),
      players: room.getPlayers(),
      questionId: room.getQuestion(),
    });
  } else {
    res.status(404).send({
      message: "Room not found",
    });
  } 
}

//----
const nextQuestion = (req, res) => {
  let roomId = req.params.roomId;
  const room = rooms.getRoomById(roomId);
  if (room) {
    room.nextQuestion();
    res.status(200).send({
      message: "Question set",
    });
  } else {
    res.status(404).send({
      message: "Room not found",
    });
  }
}

module.exports = {
  getRooms,
  joinRoom,
  createRoom,
  leaveRoom,
  getRoom,
  nextQuestion,
};
