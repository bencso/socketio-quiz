"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/app/_utils/SocketProvider";
import GameLayout from "@/app/_components/gameLayout";
import Lobby from "@/app/_components/game/lobby";
import Game from "@/app/_components/game/game";

export default function Page() {
  const { code } = useParams();
  const socket = useSocket();
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState([]);
  const [sceene, setSceene] = useState("lobby");

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

    socket.on("gameStarted", () => {
      console.log("Game started");
      setSceene("game");
    });

    return () => {
      socket.off("error");
    };
  }, [code, socket]);

  return (
    <GameLayout code={code} players={players} error={error}>
      {sceene === "lobby" && (
        <Lobby code={code} players={players} isOwner={false} />
      )}
      {
        sceene === "game" && (
          <Game />
        )
      }
    </GameLayout>
  );
}
