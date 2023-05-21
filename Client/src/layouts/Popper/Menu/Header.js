import PropTypes from 'prop-types';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from "@mui/material/Button";
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function Header({ title, onBack }) {
    return (
        <header className={cx('header')}>
            <Button className={cx('back_btn')} onClick={onBack}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <h4 className={cx('header_title')}>{title}</h4>
        </header>
    );
}

Header.propTypes = {
    title: PropTypes.string,
    onBack: PropTypes.func,
};

export default Header;
