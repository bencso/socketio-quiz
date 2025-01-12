"use client";
export default function Lobby({
    code, players, isOwner, startGame
}) {
    return (
        <>
            <div>
                <h1>Game Lobby</h1>
                <h2>Code: {code}</h2>
                <h2>Players:</h2>
                <ul>
                    {
                        //TODO: Játékosok kiiratása frissítés után
                    }
                    {players && players.map((player) => (
                        <li key={player}>{player}</li>
                    ))}
                </ul>
                {isOwner && (
                    <button onClick={startGame}>Start Game</button>
                )}
            </div>
        </>
    );
}