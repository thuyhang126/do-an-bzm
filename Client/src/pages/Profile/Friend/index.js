import { useEffect, useState } from 'react';
import { Avatar, Button } from '@mui/material';
import appConfig from '../../../config/appConfig';
import { useCrxFetch } from '../../../hooks/useCrxFetch';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from '../Profile.module.scss';
import { useParams } from 'react-router-dom';
import './index.css';
const cx = classNames.bind(styles);

export const Friend = () => {
  const { id } = useParams();
  console.log('id', id);
  const crxFetch = useCrxFetch();

  const [friends, setFriends] = useState([]);

  const getFriends = () => {
    if (!id) return;
    try {
      crxFetch.post(appConfig.friends, { id: +id }).then((res) => {
        setFriends(res.data.data.friends);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);
  return (
    <div className="wrap-friends">
      {friends.map((friend) => (
        <div
          className={cx('info')}
          style={{
            display: 'flex',
            width: '47%',
            backgroundColor: '#f4efef',
            padding: '6px 12px',
            borderRadius: '8px',
            margin: '16px 8px',
            alignItems: 'center',
          }}
        >
          <Avatar alt="Remy Sharp" src={friend.user.avatar} sx={{ width: 40, height: 40 }} />
          <div className={cx('item_info')} style={{ textAlign: 'initial', marginLeft: '6px', flex: 1 }}>
            <p className={cx('nickname')}>
              <strong style={{ marginRight: '4px' }}>{friend.user.name}</strong>
              <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} style={{ color: '#1565c0' }} />
            </p>
          </div>
          <Button size="large" variant="contained">
            Hủy kết bạn
          </Button>
        </div>
      ))}
    </div>
  );
};
