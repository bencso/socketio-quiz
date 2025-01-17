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
  const [sceene, setSceene] = useState("lobby");
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", code);
    socket.on("error", (error) => {
      setError(error);
    });

    socket.on("joinedRoom", (data) => {
      setPlayers([...data.players]);
    });

    socket.on("playerJoined", (data) => {
      console.log(data);
      setPlayers([...data]);
    });

    socket.on("playerLeft", (data) => {
      setPlayers([...data]);
    });

    socket.on("gameStarted", (data) => {
      setSceene("game");
      socket.emit("reqQuestion", data);
    });

    socket.on("getQuestion", (data) => {
      setSceene("game");
      setQuestion(data.question);
      setAnswers(data.answers);
    });

    socket.on("allAnswered", (_) => {
      setSceene("change");
    });

    socket.on("gameEnded", () => {
      console.log("gameEnded");
      setSceene("lobby");
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
          <Game isOwner={false} question={question} answers={answers} socket={socket} code={code} />
        )
      }
      {
        sceene === "change" && (
          <div>Change</div>
        )
      }
    </GameLayout>
  );
}