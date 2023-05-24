import { useContext } from 'react';
import { SocketContextType } from '../types/socket-io';
import { SocketContext } from '../contexts/Socket';

export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw Error('useSocketContext must be used inside SocketProvider');
  }
  return context;
};
