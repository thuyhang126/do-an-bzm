import { useState, useEffect, useContext } from 'react';
import { Avatar, Grid } from '@mui/material';

import classNames from 'classnames/bind';
import styles from './SidebarAction.module.scss';
import WindowMessage from '../WindowMessage';
import { SocketContext } from '../../../context/socketContext';
import appConfig from '../../../config/appConfig';
import { useCrxFetch } from '../../../hooks/useCrxFetch';

const cx = classNames.bind(styles);

function SidebarAction() {
  const crxFetch = useCrxFetch();
  const socket = useContext(SocketContext).socket;
  const user = useContext(SocketContext).user;

  const [usersContact, setUsersContact] = useState([]);
  const [windowMessages, setWindowMessages] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [page, setPage] = useState(1);
  const [still, setStill] = useState(true);

  const getComment = () => {
    if (!still) return;
    try {
      crxFetch.get(`${appConfig.getMatches}?offset=${page}`).then((res) => {
        setUsersContact([...usersContact, ...res.data.data.listMatches]);
        if (res.data.data.listMatches.length < +appConfig.limitMatch) {
          setPage(page + 1);
          setStill(false);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleWindowChat = (userContact) => {
    const findIndex = windowMessages.findIndex((item) => item.receiver_id === userContact.user.id);
    if (findIndex === -1) {
      setWindowMessages([
        ...windowMessages,
        {
          receiver_id: userContact.user.id,
          avatar: userContact.user.avatar,
          name: userContact.user.name,
        },
      ]);
    }
  };

  useEffect(() => {
    getComment();
    console.log(socket);
    if (socket) {
      socket.on('users-online', (data) => {
        setUsersOnline(data);
      });

      socket.on('show-window-message', (data) => {
        //check has windowMessage
        if (!windowMessages.find((item) => item.receiver_id === data.sender_id && data.sender_id !== user.id)) {
          setWindowMessages([
            ...windowMessages,
            { receiver_id: data.sender_id, avatar: data.sender_avatar, name: data.sender_name },
          ]);
        };
      });

      return () => {
        socket.off('users-online');
        socket.off('show-window-message');
      }
    }
  }, [socket]);

  return (
    <>
      <aside className={cx('sidebar_action')}>
        <div className={cx('category')}>
          <ul>
            <li>Bất động sản</li>
            <li>Mỹ thuật</li>
            <li>Công nghệ thông tin</li>
            <li>Bảo hiểm</li>
          </ul>
        </div>
        <p>Contact people</p>
        <div className={cx('list_user_online')}>
          <ul>
            {usersContact.map((userContact) => (
              <li key={userContact.id} onClick={(e) => handleWindowChat(userContact)}>
                <div className={cx('account_item')}>
                  <img className={cx('avatar')} alt="avatar" src={userContact.user.avatar} />
                  <strong>{userContact.user.name}</strong>
                </div>
                <span
                  className={cx(
                    usersOnline.includes(
                      userContact.user_id !== user.id
                        ? userContact.user_id.toString()
                        : userContact.object_id.toString(),
                    )
                      ? 'online'
                      : 'offline',
                  )}
                ></span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <div className={cx('listMessage')}>
        {windowMessages.map((windowMessage, i) => (
          <>
            {i < 3 ? (
              <li key={i}>
                <WindowMessage data={{ dataWindow: windowMessage, windowMessages, setWindowMessages }} />
              </li>
            ) : (
              <Grid sx={{ position: 'absolute', bottom: '24px', right: '-56px' }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ width: 48, height: 48, mt: '12px' }} />
              </Grid>
            )}
          </>
        ))}
      </div>
    </>
  );
}

export default SidebarAction;
