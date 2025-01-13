"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/app/_utils/SocketProvider";
import GameLayout from "@/app/_components/gameLayout";
import Lobby from "@/app/_components/game/lobby";
import Game from "@/app/_components/game/game";

export default function Page() {
  const { quizId } = useParams();
  const socket = useSocket();
  const [error, setError] = useState(null);
  const [code, setCode] = useState(null);
  const [sceene, setSceene] = useState("lobby");
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit("createRoom", quizId);
    socket.on("error", (error) => {
      setError(error);
    });

    socket.on("createdRoom", (data) => {
      setCode(data.code);
      console.log(data.players);
      setPlayers([...data.players]);
    });

    socket.on("playerJoined", (data) => {
      setPlayers([...data]);
    });

    socket.on("playerLeft", (data) => {
      setPlayers([...data]);
      console.log(data);
    });

    socket.on("gameStarted", (data) => {
      setSceene("game");
      socket.emit("nextQuestion", data);
    });

    socket.on("getQuestion", (data) => {
      console.log(data);
    });

    return () => {
      socket.off("error");
    };
  }, [quizId, socket]);


  return (
    <GameLayout code={code} players={players} error={error}>
      {sceene === "lobby" && (
        <Lobby code={code} players={players} isOwner={true} startGame={() => {
          socket.emit("startGame", code);
        }} />
      )}
      {
        sceene === "game" && (
          <Game />
        )
      }
    </GameLayout>
  );
}