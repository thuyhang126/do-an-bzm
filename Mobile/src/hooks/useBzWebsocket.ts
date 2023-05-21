import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import io, {Socket} from 'socket.io-client';

import {API} from '../constants';
import {RootState} from '../redux/store';

const useBzWebSockets = () => {
  const ref = useRef<Socket>();
  const token = useSelector((state: RootState) => state.token);

  const emit = (event: string, payload: any) => {
    ref.current!.emit(event, payload);
  };

  const on = (event: string, handle: any) => {
    ref.current!.on(event, payload => handle(payload));
  };

  const id = () => {
    return ref.current!.id;
  };

  const off = (event: string) => {
    ref.current!.off(event);
  };

  useEffect(() => {
    const socket = io(API.WS_URL, {
      extraHeaders: {
        authorization: 'Bearer ' + token.accessToken,
      },
    });

    socket.on('error', err => console.log(err));
    socket.on('connect_error', err => console.log(err));

    socket.on('connect', () => console.log(socket.id, 'connected'));
    socket.on('connect_error', attempt =>
      console.log(socket.id, 'reconnected at', attempt),
    );

    ref.current = socket;

    return () => {
      socket.off('connect');
      socket.off('error');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [token]);

  return {id, emit, on, off};
};

export default useBzWebSockets;
