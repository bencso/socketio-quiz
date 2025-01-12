"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/app/_utils/SocketProvider";

export default function Page() {
  const { code } = useParams();
  const socket = useSocket();
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", code);
    socket.on("error", (error) => {
      setError(error);
    });

    socket.on("joinedRoom", (room) => {
      socket.emit("playerJoin", {
        room_id: room.room_id,
        player_id: socket.id,
        players: room.players,
      });
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
  }, [code, socket]);

  return (
    <div>
      {error && <div>{error}</div>}
      <h1>{code}</h1>
      <h2>Players:</h2>
      <ul>
        {players && players.map((player) => <li key={player}>{player}</li>)}
      </ul>
    </div>
  );
}
