import { FC, PropsWithChildren } from 'react';
import { SocketContext } from './Socket';
import { useSocket } from '../hooks/useSocket';
import { SocketContextType } from '../types/socket-io';

const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const { socket, online } = useSocket('http://localhost:8080');

  const valueProvider: SocketContextType = {
    socket,
    online,
  };

  return (
    <SocketContext.Provider value={valueProvider}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
