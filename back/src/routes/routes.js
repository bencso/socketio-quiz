// Importálások
const express = require("express");
const router = express.Router();
const { createRoom, getRooms, getRoom} = require("../controllers/roomController");

router.route("/").get((_, res) => {
    res.send(
        `
        <h1>Routes</h1>
        <p>GET /api/rooms - Szobák lekérdezése</p>
        <p>GET /api/room/:code - Szoba lekérdezése</p>
        <p>POST /api/create/rooms/:quizId - Szoba létrehozása</p>
        `
    );
});
router.route("/rooms").get(getRooms);
router.route("/room/:code").get(getRoom);
router.route("/c/room/:quizId").post(createRoom);

module.exports = router;