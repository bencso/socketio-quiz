"use client";


export default function Game({
    question,
    answers,
    socket,
    code,
    isOwner,
}) {

    function selectAnswer(answer, socket, code) {
        socket.emit("answer", { answer, code, playerId: socket.id });
    }

    return (
        <div>
            <h1>Game</h1>
            <h2>{question}</h2>
            <ul>
                {
                    answers.map((answer, _) => {
                        return (
                            isOwner ? <li key={answer.answer_id} onClick={() => selectAnswer(answer.answer_id, socket, code)}>{answer.answer}</li> : <li key={answer.answer_id}>{answer.answer}</li>
                        );
                    })
                }
            </ul>
        </div>
    );
}