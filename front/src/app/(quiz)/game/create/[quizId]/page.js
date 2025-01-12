"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/app/_utils/SocketProvider";

function startGame(code) {
  socket.emit("startGame", code);
}

export default function Page() {
  const { quizId } = useParams();
  const socket = useSocket();
  const [error, setError] = useState(null);
  const [code, setCode] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("createRoom", quizId);
    socket.on("error", (error) => {
      setError(error);
    });

    socket.on("createdRoom", (room) => {
      setCode(room.code);
      setPlayers(room.players);
      console.log(room);
    });

    socket.on("playerJoined", (data) => {
      setPlayers(data.players);
      console.log(data);
    });

    socket.on("playerLeft", (data) => {
      setPlayers(data.players);
      console.log(data);
    });

    return () => {
      socket.off("error");
    };
  }, [quizId, socket]);

  return (
    <div>
      {error && <div>{error}</div>}
      <h1>{code}</h1>
      <h2>Players:</h2>
      <ul id="players">
        {players && players.map((player) => <li key={player}>{player}</li>)}
      </ul>
      <button onClick={() => startGame(code)}>Start Game</button>
    </div>
  );
}
