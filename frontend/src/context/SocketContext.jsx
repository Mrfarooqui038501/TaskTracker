import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Only create socket connection if needed (when user is authenticated)
    const token = localStorage.getItem('token');
    if (!token) return;

    // Create socket connection with auth token
    const socketInstance = io('http://localhost:5000', {
      auth: {
        token
      }
    });

    // Socket event handlers
    socketInstance.on('connect', () => {
      console.log('Socket.IO connected:', socketInstance.id);
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setConnected(false);
    });

    socketInstance.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};