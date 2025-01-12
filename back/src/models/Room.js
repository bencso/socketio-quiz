class Room {
    constructor(id, owner, code) {
        this.id = id;
        this.owner = owner;
        this.code = code;
        this.players = [];
        this.questions = [];
        this.currentQuestionIndex = 0;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(player) {
        this.players = this.players.filter((p) => p.id !== player.id);
    }

    getPlayers() {
        return this.players;
    }

    addQuestion(question) {
        this.questions.push(question);
    }

    getQuestions(){
        return this.questions;
    }

    getOwner() {
        return this.owner;
    }

    getCode() {
        return this.code;
    }

    getQuizId() {
        return this.quizId;
    }

    getId() {
        return this.id;
    }

    getQuestionIndex() {
        return this.currentQuestionIndex;
    }

    incrementQuestionIndex() {
        this.currentQuestionIndex++;
    }
}

class Rooms {
    constructor() {
        this.rooms = [];
    }

    addRoom(room) {
        this.rooms.push(room);
    }

    removeRoom(room) {
        this.rooms = this.rooms.filter((r) => r.id !== room.id);
    }

    getRooms() {
        return this.rooms;
    }

    getRoom(code) {
        return this.rooms.find((r) => r.code === code);
    }
}

module.exports = {
    Room,
    Rooms,
};