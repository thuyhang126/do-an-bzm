import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCrxFetch } from '../../hooks/useCrxFetch';

import styles from './Profile.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';
import appConfig from '../../config/appConfig';
import Info from './Info/info';
import UpdateInfo from './Info/updateInfo';
import { ProfilePost } from './Post';
import { Friend } from './Friend';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function Profile() {
  const { id } = useParams();
  console.log(id);

  const crxFetch = useCrxFetch();
  const [user, setUser] = useState({});
  const [updateInfo, setUpdateInfo] = useState(false);
  const [titleProfile, setTitleProfile] = useState('Thông tin cá nhân');

  const getInfo = () => {
    crxFetch.get(`${appConfig.profile}/${id}`).then((res) => {
      setUser(res.data.data.user);
      console.log(res.data.data.user);
    });
  };

  useEffect(() => {
    getInfo();
  }, [id]);
  return (
    <div className={cx('wrapper_profile')}>
      <div className={cx('about_user')}>
        <div className={cx('info')}>
          <Image src={user.avatar} className={cx('user_avatar')} alt={user.name} />
          <div className={cx('item_info')}>
            <p className={cx('nickname')}>
              <strong>{user.name}</strong>
              {<FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />}
            </p>
            <p className={cx('name')}>{user.email}</p>
            <Button className={cx('follow_btn')} primary>
              Add frend
            </Button>
          </div>
        </div>
        <div className={cx('list_category')}>
          <ul>
            <li
              style={{
                cursor: 'pointer',
                backgroundColor: titleProfile === 'Thông tin cá nhân' ? '#fe2c55' : '#1476d2',
              }}
              onClick={() => setTitleProfile('Thông tin cá nhân')}
            >
              Thông tin cá nhân
            </li>
            <li
              style={{ cursor: 'pointer', backgroundColor: titleProfile === 'Bài viết' ? '#fe2c55' : '#1476d2' }}
              onClick={() => setTitleProfile('Bài viết')}
            >
              Bài viết
            </li>
            <li
              style={{ cursor: 'pointer', backgroundColor: titleProfile === 'Bạn bè' ? '#fe2c55' : '#1476d2' }}
              onClick={() => setTitleProfile('Bạn bè')}
            >
              Bạn bè
            </li>
          </ul>
        </div>
      </div>
      {user.id && !updateInfo && titleProfile === 'Thông tin cá nhân' && (
        <Info user={user} setUpdateInfo={setUpdateInfo} />
      )}
      {user.id && updateInfo && titleProfile === 'Thông tin cá nhân' && (
        <UpdateInfo user={user} setUser={setUser} setUpdateInfo={setUpdateInfo} />
      )}
      {user.id && titleProfile === 'Bài viết' && <ProfilePost user={user} />}
      {user.id && titleProfile === 'Bạn bè' && <Friend />}
    </div>
  );
}

export default Profile;
