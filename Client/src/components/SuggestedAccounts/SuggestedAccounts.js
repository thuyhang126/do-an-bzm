import { useEffect, useState } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './SuggestedAccounts.module.scss';
import AccountItem from './AccountItem';

const cx = classNames.bind(styles);

function SuggestedAccounts({ label }) {
    const [users, setUsers] = useState([]);
    const [pages, setPages] = useState(1);
    const [perPage, setPerPage] = useState(5);

    const handleSee = () => {
        let apiGetSee;
        if (pages === 1) {
            setPages((pages) => pages + 1);
            setPerPage((perPage) => perPage + 10);
            apiGetSee = `https://tiktok.fullstack.edu.vn/api/users/suggested?page=${pages + 1}&per_page=${
                perPage + 10
            }`;
        } else {
            setPages((pages) => pages - 1);
            setPerPage((perPage) => perPage - 10);
            apiGetSee = `https://tiktok.fullstack.edu.vn/api/users/suggested?page=${pages - 1}&per_page=${
                perPage - 10
            }`;
        }

        axios
            .get(apiGetSee)
            .then(function (res) {
                setUsers((prev) => {
                    if (pages === 1) {
                        return [...prev, ...res.data.data];
                    } else {
                        return res.data.data;
                    }
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    useEffect(() => {
        axios
            .get(`https://tiktok.fullstack.edu.vn/api/users/suggested?page=${pages}&per_page=${perPage}`)
            .then(function (res) {
                setUsers(res.data.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [pages, perPage]);
    return (
        <div className={cx('wrapper')}>
            <p className={cx('label')}>{label}</p>
            {users.map((user) => (
                <AccountItem key={user.id} data={user} />
            ))}

            <p className={cx('more_btn')} onClick={handleSee}>
                {pages === 1 ? 'See all' : 'See less'}
            </p>
        </div>
    );
}

SuggestedAccounts.propTypes = {
    label: PropTypes.string.isRequired,
};

export default SuggestedAccounts;
