class Room {
  constructor(id, owner, code) {
    this.id = id;
    this.owner = owner;
    this.code = code;
    this.players = [];
    this.question = [];
    this.currentQuestionIndex = 0;
  }

  addPlayer(player) {
    const _player = {
      id: player,
      score: 0,
      answered: false,
    }
    if(this.players.length === 0) _player.answered = true;
    this.players.push(_player);
  }

  addQuestion(question_id) {
    this.question.push(question_id);
  }

  removePlayer(playerId) {
    this.players = this.players.filter((p) => p !== playerId);
  }

  playerAnswered(playerId) {
    let player = this.players.find((p) => p.id === playerId);
    player.answered = true;
    let allAnswered = this.players.every((p)=> p.answered);
    if(allAnswered) this.players.forEach((p)=> p.answered = false);
    return allAnswered;
  }

  checkAnswers() {
    return this.players.every((p)=> p.answered);
  }


  getPlayers() {
    return this.players;
  }

  getQuestion() {
    return this.question[this.currentQuestionIndex];
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
    if(this.currentQuestionIndex >= this.question.length) this.currentQuestionIndex = 0;
    return this.currentQuestionIndex;
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
