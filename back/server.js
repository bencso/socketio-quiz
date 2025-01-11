// Importálások
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const winston = require("winston");
const { v4 } = require("uuid");
const mysql = require('mysql');

// Adatbázis beállítás
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project',
    multipleStatements: true
});

// Logoló beállítás
//? A logolásra winstont használunk, hogy átláthatóbb legyen az egész.
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.label({ label: "WebsocketServer" }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({
                    all: true,
                }),
                winston.format.printf(
                    (log) => `${log.timestamp} [\x1b[36m${log.label}\x1b[0m - ${log.level}]: ${log.message}`
                ),
            ),
        }),
        new winston.transports.File({
            filename: "server.log", format: winston.format.combine(
                winston.format.printf(
                    (log) => `${log.timestamp} [${log.label} - ${log.level}]: ${log.message}`
                ),
            ),
        }),
    ],
});

connection.connect(function (err) {
    if (err) {
        logger.error('Adatbázis hiba: ' + err.stack);
    } else {
        logger.info('Csatlakozva az adatbázishoz! ID: ' + connection.threadId);
    }
});

// Szerver beállítás
const PORT = 3001; //TODO: Késöbb az .env-ből kell majd kiolvasni
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
        fetch("http://localhost:3001/api/create/room/" + quizId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                socketId: socket.id,
            })
        })
            .then((res) => res.json())
            .then((data) => {
                socket.join(data.code);
                socket.emit("roomCreated", { code: data.code });
            });
    });

    socket.on("disconnect", () => {
        logger.info("Kliens kilépett! ID: " + socket.id);
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
    logger.info('A szerver elindult! Port: ' + PORT);
});