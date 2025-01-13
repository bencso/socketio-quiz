// Importálások
const express = require("express");
const router = express.Router();
const { createRoom, getRooms, joinRoom, nextQuestion, leaveRoom, getQuestion, getRoom, answer } = require("../controllers/roomController");

router.route("/").get((_, res) => {
    res.send(
        `
        <h1>Routes</h1>
        <p>GET /api/rooms - Szobák lekérdezése</p>
        <p>POST /api/j/room/:code - Szobába csatlakozás</p>
        <p>POST /api/c/room/:quizId - Szoba létrehozása</p>
        <p>POST /api/l/room/:code - Szobából kilépés</p>
        `
    );
});

// Szoba útvonalak
//TODO: Szebb routes
router.route("/rooms").get(getRooms);
router.route("/j/room/:code").post(joinRoom);
router.route("/c/room/:quizId").post(createRoom);
router.route("/l/room").post(leaveRoom);
//----
router.route("/room/:code").get(getRoom);
router.route("/room/:roomId/question").get(getQuestion);
router.route("/room/:roomId").put(nextQuestion);
router.route("/room/:code/answer").post(answer);


module.exports = router;