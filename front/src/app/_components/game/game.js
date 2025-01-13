"use client";


export default function Game({
    question,
    answers,
    socket,
    code
}) {

    function selectAnswer(answer, socket, code) {
        socket.emit("answer", { answer, code });
    }

    return (
        <div>
            <h1>Game</h1>
            <h2>{question}</h2>
            <ul>
                {
                    answers.map((answer, index) => {
                        return (
                            <li key={index} onClick={() => selectAnswer(answer.answer_id, socket, code)}>{answer.answer}</li>
                        );
                    })
                }
            </ul>
        </div>
    );
}