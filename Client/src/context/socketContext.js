import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const tokenStorage = JSON.parse(localStorage.getItem('token')) || '';
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [token, setToken] = useState(tokenStorage);
  const URL = 'http://localhost:8000';
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(URL, {
      extraHeaders: {
        authorization: 'Bearer ' + token.accessToken,
      },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      newSocket.off();
    };
  }, [token]);

  return <SocketContext.Provider value={{ socket, user }}>{children}</SocketContext.Provider>;
};

export { SocketContext, SocketProvider };
