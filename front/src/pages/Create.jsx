import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
    const [isOwner, setIsOwner] = useState(false);
    const [room, setRoom] = useState({});
    const { quizID } = useParams();

    useEffect(() => {
        socket.emit('createRoom', quizID);
        socket.on('createdRoom', (data) => {
            setIsOwner(true);
            setRoom(data);
        });

        return () => {
            socket.off('createdRoom');
        };
    }, [quizID]);

    return (
        <>
            {room && (
                <>
                    <h2>CODE: {room.code}</h2>
                    <p>Owner: {isOwner}</p>
                    <h3>Players:</h3>
                    <ul id="players">
                        {room.players &&
                            room.players.map((player) => (
                                <li key={player.id}>{player.id}</li>
                            ))}
                    </ul>
                </>
            )}
        </>
    );
}

export default App;
