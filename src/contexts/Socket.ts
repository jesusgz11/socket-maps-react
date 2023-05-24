import { createContext } from 'react';
import { SocketContextType } from '../types/socket-io';

export const SocketContext = createContext<SocketContextType | null>(null);
