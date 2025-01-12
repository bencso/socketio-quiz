"use client";
import React, { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKETURL = "http://localhost:3001";
const SocketContext = createContext();

export const useSocket = () => {
  return React.useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io(SOCKETURL, {
        transports: ["websocket"],
        withCredentials: true,
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  );
};
