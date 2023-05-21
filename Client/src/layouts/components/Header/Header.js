import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleQuestion,
  // faCloudUpload,
  faCoins,
  faEarthAsia,
  faEllipsisVertical,
  faGear,
  faKeyboard,
  faSignOut,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';

import config from '~/config';
import Image from '~/components/Image';
import Menu from '../../Popper/Menu';
import Button from '@mui/material/Button';
import styles from './Header.module.scss';
import images from '~/assets/images';
import { Messenger } from '~/components/Icons';
import Search from '../Search';
import { UserContext } from '../../../context/userContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
  {
    icon: <FontAwesomeIcon icon={faEarthAsia} />,
    title: 'English',
    children: {
      title: 'Language',
      data: [
        {
          type: 'language',
          code: 'en',
          title: 'English',
        },
        {
          type: 'language',
          code: 'vi',
          title: 'Tiếng Việt',
        },
      ],
    },
  },
  {
    icon: <FontAwesomeIcon icon={faCircleQuestion} />,
    title: 'Feedback and Help',
    to: '/feedback',
  },
  {
    icon: <FontAwesomeIcon icon={faKeyboard} />,
    title: 'Keybord shortcuts',
  },
];

function Header() {
  const currentUser = true;
  const user = useContext(UserContext).user;
  const navigate = useNavigate();

  const handleMenuChange = (menuItem) => {
    navigate(menuItem.to);
  };

  const userMenu = [
    {
      icon: <FontAwesomeIcon icon={faUser} />,
      title: 'View profile',
      to: `/profile/${user.id}`,
    },
    // {
    //   icon: <FontAwesomeIcon icon={faCoins} />,
    //   title: 'Get coins',
    //   to: '/coin',
    // },
    // {
    //   icon: <FontAwesomeIcon icon={faGear} />,
    //   title: 'Setting',
    //   to: '/setting',
    // },
    // ...MENU_ITEMS,
    {
      icon: <FontAwesomeIcon icon={faSignOut} />,
      title: 'Logout',
      to: '/login',
      separate: true,
    },
  ];

  return (
    <header className={cx('wrapper')}>
      <div className={cx('inner')}>
        <Link to={config.routes.home} className={cx('logo_link')}>
          <img src={images.bizLogo} alt="Biz"></img>
        </Link>
        <Search />
        <div className={cx('actions')}>
          {currentUser ? (
            <>
              <Button outline>Upload</Button>
              {/* <Tippy delay={[0, 200]} content="Upload video" placement="bottom">
                                <button className={cx('action_btn')}>
                                    <FontAwesomeIcon icon={faCloudUpload} />
                                </button>
                            </Tippy> */}
              <Tippy delay={[0, 200]} content="Messenger" placement="bottom">
                <Button className={cx('action_btn')}>
                  <Messenger />
                </Button>
              </Tippy>
            </>
          ) : (
            <>
              <Button text>Upload</Button>
              <Button>Log in</Button>
            </>
          )}
          <Menu items={currentUser ? userMenu : MENU_ITEMS} onChange={handleMenuChange}>
            {currentUser ? (
              <Image src={user.avatar} className={cx('user_avatar')} alt={user.name} />
            ) : (
              <Button className={cx('more_btn')}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </Button>
            )}
          </Menu>
        </div>
      </div>
    </header>
  );
}

export default Header;
