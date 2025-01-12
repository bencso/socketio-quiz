import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
    const [room, setRoom] = useState({});
    const { roomID } = useParams();

    useEffect(() => {
        socket.emit('joinRoom', roomID);

        socket.on('joinedRoom', (data) => {
            console.log(data);
            setRoom(data);
        });

        return () => {
            socket.off('joinedRoom');
        };
    }, [roomID]);

    return (
        <>
            {room && (
                <>
                    <h2>CODE: {room.code}</h2>
                    <h3>Players</h3>
                    <ul id="players">
                        {room.players &&
                            room.players.map((player) => (
                                <li key={player}>{player}</li>
                            ))}
                    </ul>
                </>
            )}
        </>
    );
}

export default App;
