import {createContext} from 'react';

interface SocketContextProps {
  id: () => string;
  emit: (event: string, payload: any) => void;
  on: (event: string, payload: any) => void;
  off: (event: string) => void;
}

export const SocketContext = createContext<SocketContextProps | null>(null);
export const SocketContextProvider = SocketContext.Provider;
export const SocketContextConsumer = SocketContext.Consumer;
