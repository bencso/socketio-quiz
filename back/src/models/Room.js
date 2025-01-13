class Room {
  constructor(id, owner, code) {
    this.id = id;
    this.owner = owner;
    this.code = code;
    this.players = [];
    this.currentQuestionIndex = 0;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(playerId) {
    this.players = this.players.filter((p) => p !== playerId);
  }

  getPlayers() {
    return this.players;
  }

  getQuestion() {
    return this.currentQuestionIndex;
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

  nextQuestion() {
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

  getRoomById(id) {
    return this.rooms.find((r) => r.id === id);
  }

  getRoomsByPlayer(player) {
    let room = this.rooms.find((r) =>
      r.players.find((p) => p.id === player.id)
    );
    console.log(room);
    return room;
  }
}

export { Room, Rooms };
