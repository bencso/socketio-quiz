"use client";

import { useEffect } from "react";

export default function Lobby({ code, players, isOwner, startGame }) {

    useEffect(() => {
        const playersDiv = document.getElementById("players");
        playersDiv.innerHTML = "";
        players.forEach((player) => {
            const li = document.createElement("li");
            li.textContent = player;
            playersDiv.appendChild(li);
        }
        );
    }, [players]);


    return (
        <>
            <div>
                <h1>Game Lobby</h1>
                <h2>Code: {code}</h2>
                <h2>Players:</h2>
                <ul>
                    <div id="players"></div>
                </ul>
                {isOwner && (
                    <button onClick={startGame}>Start Game</button>
                )}
            </div>
        </>
    );
}