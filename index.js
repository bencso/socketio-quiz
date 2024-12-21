// Importálások
const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

// Változók
const PORT = 3000;

// Példányosítások
const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "views", "index.html"));
});

io.on("connection", (socket) =>{
  console.log("User connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
})

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
