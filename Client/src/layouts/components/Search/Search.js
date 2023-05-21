import { Wrapper as PopperWrapper } from '~/layouts/Popper';
import AccountItem from '~/components/AccountItem';
import HeadlessTippy from '@tippyjs/react/headless';
import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from "@mui/material/Button";

import * as searchServices from '~/services/searchService';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from './Search.module.scss';
import { SearchIcon } from '~/components/Icons';
import { useDebounce } from '~/hooks';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResults, setShowResults] = useState(true);
    const [loading, setLoading] = useState(false);

    const debounced = useDebounce(searchValue, 500);

    const inputRef = useRef();

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };

    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    const handleHideResult = () => {
        setShowResults(false);
    };

    useEffect(() => {
        if (!debounced.trim()) {
            setSearchResult([]);
            return;
        }

        const fetchApi = async () => {
            setLoading(true);

            const results = await searchServices.search(debounced);
            setSearchResult(results);

            setLoading(false);
        };

        fetchApi();

        // dung fetch da custom
        // request
        //     .get('users/search', {
        //         params: {
        //             q: debounced,
        //             type: 'less',
        //         },
        //     })
        //     .then((res) => {
        //         setSearchResult(res.data);
        //         setLoading(false);
        //     })
        //     .catch(() => {
        //         setLoading(false);
        //     });
    }, [debounced]);

    return (
        //Using a wrapper <div> tag around the reference element solves this by
        //creating a new parentNode context.
        <div>
            <HeadlessTippy
                interactive
                visible={searchResult.length > 0 && showResults}
                render={(attrs) => (
                    <div className={cx('search_result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search_title')}>Account</h4>
                            {searchResult.map((result) => (
                                <AccountItem key={result.id} data={result} />
                            ))}
                        </PopperWrapper>
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                <div className={cx('search')}>
                    <input
                        ref={inputRef}
                        value={searchValue}
                        placeholder="Search accounts and videos"
                        spellCheck={false}
                        onChange={handleChange}
                        onFocus={() => setShowResults(true)}
                    />
                    {searchValue && !loading && (
                        <Button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </Button>
                    )}
                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}

                    <Button className={cx('search_btn')} onMouseDown={(e) => e.preventDefault()}>
                        <SearchIcon />
                    </Button>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
