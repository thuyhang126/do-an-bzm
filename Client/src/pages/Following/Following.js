import React, { useContext, useEffect } from 'react';
import './css/chat.css';
import './css/shared.css';
import './css/style.css';
import { connect, hangUpCall } from '../../chatclient';
import { SocketContext } from '../../context/socketContext';
import { UserContext } from '../../context/userContext';

const Following = () => {
  const socket = useContext(SocketContext).socket;
  const user = useContext(UserContext).user;

  const handLeCall = () => {
    connect({ email: user.email });
    handleInviteCall(user.id);
  };

  const handleInviteCall = (receiver_id) => {
    socket.emit('invite-call', receiver_id === 4 ? 5 : 4);
  };

  useEffect(() => {
    if (socket) {
      socket.on('accept-call', () => {
        connect({ email: user.email });
        console.log('1234');
      });

      return () => {
        socket.off('accept-call');
      };
    }
  }, [socket]);
  return (
    <div className="container">
      <div className="infobox">
        <p>Click a username in the user list to ask them to enter a one-on-one video chat with you.</p>
        <p>
          Enter a username:
          <input
            id="name"
            type="text"
            maxLength="12"
            required
            autoComplete="username"
            inputMode="verbatim"
            placeholder="Username"
          />
          <input type="button" name="login" value="Log in" onClick={() => handLeCall()} />
        </p>
      </div>
      <ul className="userlistbox"></ul>
      <div className="chatbox"></div>
      <div className="camerabox">
        <video id="received_video" autoPlay></video>
        <video id="local_video" autoPlay muted></video>
        <button
          id="hangup-button"
          onClick={() => {
            hangUpCall();
          }}
        >
          Hang Up
        </button>
      </div>
    </div>
  );
};

export default Following;
