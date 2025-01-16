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
  const [answers, setAnswers] = useState([]);

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
      socket.emit("reqQuestion", data);
    });

    socket.on("getQuestion", (data) => {
      console.log(data);
      setQuestion(data.question);
      setAnswers(data.answers);
    });

    socket.on("allAnswered", (data) => {
      setSceene("change");
      console.log(data);
      setTimeout(() => {
        setSceene("game");
        socket.emit("nextQuestion", data);
      }, 1000);
    });

    socket.on("gameEnded", () => {
      console.log("gameEnded");
      setSceene("lobby");
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
          <Game isOwner={true} question={question} answers={answers} socket={socket} code={code} />
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