// Importálások
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4 } = require("uuid");
const connection = require("./src/config/db");
const logger = require("./src/config/logger");

connection.connect(function (err) {
  if (err) {
    logger.error("Adatbázis hiba: " + err.stack);
  } else {
    logger.info("Csatlakozva az adatbázishoz! ID: " + connection.threadId);
  }
});

// Szerver beállítás
const PORT = 3001; //TODO: Késöbb az .env-ből kell majd kiolvasni
const API_URL = "http://localhost:3001/api"; //? Végleges API URL
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", //TODO: a Next.js szerverének címe kell majd ide
    methods: ["GET", "POST"],
  },
});

io.engine.generateId = () => {
  return v4();
};

// Socket.io események
io.on("connection", (socket) => {
  logger.info("Új kliens! ID: " + socket.id);

  /*
        Mikor az apinál /create/room/:roomId végpontra érkezik egy kérés, akkor a szerver
        Szoba létrehozás: Amikor a client egy létrehozna egy szobát, akkor a 
        quizId-t elküldi a szervernek, ezekután a szerver generál egy csatlakozó kódot
        és egy szobát deklarál, amelyet letárol szerver oldalon. Ez a kódot pedig a kliensnek átküldi
    */
  socket.on("createRoom", (quizId) => {
    fetch(`${API_URL}/c/room/${quizId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        socketId: socket.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        socket.join(data.room_id);
        socket.emit("createdRoom", {
          code: data.code,
          room_id: data.room_id,
          players: data.players,
        });
      });
  });

  socket.on("joinRoom", (code) => {
    fetch(`${API_URL}/j/room/${code}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        socketId: socket.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        socket.join(data.room_id);
        socket.emit("joinedRoom", {
          code: data.code,
          room_id: data.room_id,
          players: data.players,
        });
      });
  });

  socket.on("playerJoin", (data) => {
    logger.info(
      "Játékos csatlakozott a szobához! Szoba: " +
        data.room_id +
        " Játékos: " +
        data.player_id
    );
    io.to(data.room_id).emit("playerJoined", data.players);
  });

  socket.on("startGame", (code) => { 
    logger.info("Játék indítása! Szoba: " + code);
    fetch(`${API_URL}/room/${code}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        io.to(data.room_id).emit("gameStarted", data);
      });
  });


  socket.on("disconnect", () => {
    fetch(`${API_URL}/l/room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        socketId: socket.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        io.to(data.room_id).emit("playerLeft", data.players);
        logger.info("Kliens kilépett a szobából! Szoba: " + data.room_id, {
          players: data.players,
        });
      });
  });
});

// API végpontok
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //TODO: A kliens oldal címe kell majd ide
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/api", require("./src/routes/routes"));

server.listen(PORT, () => {
  logger.info("A szerver elindult! Port: " + PORT);
});
