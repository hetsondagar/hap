import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token && !socketRef.current) {
      const newSocket = io(SOCKET_URL, {
        auth: {
          token,
        },
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setConnected(false);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
    };
  }, []);

  const joinEventRoom = (eventId: string) => {
    if (socket) {
      socket.emit('join_event', eventId);
    }
  };

  const leaveEventRoom = (eventId: string) => {
    if (socket) {
      socket.emit('leave_event', eventId);
    }
  };

  const sendChatMessage = (eventId: string, message: string) => {
    if (socket) {
      socket.emit('chat_message', { eventId, message });
    }
  };

  const onChatMessage = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('chat_message', callback);
    }
  };

  const onNotification = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('notification', callback);
    }
  };

  const onLeaderboardUpdate = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('leaderboard_update', callback);
    }
  };

  const offChatMessage = () => {
    if (socket) {
      socket.off('chat_message');
    }
  };

  const offNotification = () => {
    if (socket) {
      socket.off('notification');
    }
  };

  const offLeaderboardUpdate = () => {
    if (socket) {
      socket.off('leaderboard_update');
    }
  };

  return {
    socket,
    connected,
    joinEventRoom,
    leaveEventRoom,
    sendChatMessage,
    onChatMessage,
    onNotification,
    onLeaderboardUpdate,
    offChatMessage,
    offNotification,
    offLeaderboardUpdate,
  };
};
