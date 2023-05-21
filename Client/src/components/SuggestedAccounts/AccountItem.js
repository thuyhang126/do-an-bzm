import classNames from 'classnames/bind';
import styles from './SuggestedAccounts.module.scss';
// import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/layouts/Popper';
import AccountPreview from './AccountPreview/AccountPreview';

const cx = classNames.bind(styles);

const renderPreview = (props) => {
  return (
    <div tabIndex="-1" {...props}>
      <PopperWrapper>
        <AccountPreview data={props} />
      </PopperWrapper>
    </div>
  );
};

function AccountItem(data) {
  return (
    <div>
      <Tippy
        interactive
        delay={[800, 0]}
        offset={[-20, 0]}
        placement="bottom-end"
        render={() => renderPreview(data.data)}
      >
        <div className={cx('account_item')}>
          <img className={cx('avatar')} alt="avatar" src={data.data.avatar} />
          <div className={cx('item_info')}>
            <p className={cx('nickname')}>
              <strong>{data.data.nickname}</strong>
              {data.data.tick ? <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} /> : undefined}
            </p>
            <p className={cx('name')}>{data.data.first_name + ' ' + data.data.last_name}</p>
          </div>
        </div>
      </Tippy>
    </div>
  );
}

export default AccountItem;
