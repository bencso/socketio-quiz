"use client";

export default function Game({ question, answers, socket, code, isOwner }) {
    function selectAnswer(answerId, socket, code) {
        socket.emit("answer", { answerId, code, playerId: socket.id });
    }

    return (
        <div>
            <h1>Game</h1>
            <h2>{question}</h2>
            <ul>
                {answers.map((answer, _) => {
                    return isOwner == true ? (
                        <li
                            key={answer.answer_id}
                        >
                            {answer.answer}
                            {answer.answered ? "✅" : "❌"}
                        </li>
                    ) : (
                        <li
                            key={answer.answer_id}
                            onClick={() => selectAnswer(answer.answer_id, socket, code)}
                        >
                            {answer.answer}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
