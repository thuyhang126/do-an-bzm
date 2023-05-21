import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import Button from '@mui/material/Button';
import styles from './AccountPreview.module.scss';

const cx = classNames.bind(styles);

function AccountPreview(data) {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <img src={data.data.avatar} alt="avtar preview" className={cx('avatar')} />
        <Button className={cx('follow_btn')}>Follow</Button>
      </div>
      <div className={cx('body')}>
        <p className={cx('nickname')}>
          <strong>{data.data.first_name + ' ' + data.data.last_name}</strong>
          {data.data.tick ? <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} /> : undefined}
        </p>
        <p className={cx('name')}>{data.data.nickname}</p>
        <p className={cx('analytics')}>
          <strong className={cx('value')}>{data.data.followers_count}</strong>
          <span className={cx('label')}> followers</span>
          <strong className={cx('value')}>{data.data.likes_count} </strong>
          <span className={cx('label')}>likes</span>
        </p>
      </div>
    </div>
  );
}

export default AccountPreview;
