import { useRef, useState } from 'react';
import { Avatar, Box, Button, Autocomplete, TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { faCheckCircle, faCamera, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Textarea from '@mui/joy/Textarea';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { useCrxFetch } from '../../../hooks/useCrxFetch';
import appConfig from '../../../config/appConfig';
import styles from '../Profile.module.scss';

import './index.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export const CreatePost = ({ user, setOpen, open, setPosts, posts }) => {
  const optionsCategory = [
    'Công nghệ thông tin',
    'Liên kết kinh doanh',
    'Kết bạn kinh doanh',
    'Giao lưu học hỏi',
    'Chia sẻ thông tin',
  ];

  const crxFetch = useCrxFetch();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [urlImgs, setUrlImgs] = useState([]);
  const [imgs, setImgs] = useState('');

  const refFiles1 = useRef();
  const refFiles2 = useRef();

  const getUrlsByFileReader = async (files) => {
    console.log(files);
    const validImageTypes = [`image/gif`, `image/jpeg`, `image/png`];
    let checkType = true;
    files.forEach((file) => {
      if (!validImageTypes.includes(file.type)) return (checkType = false);
    });
    if (!checkType)
      return alert(`Please select images in the correct format ['image/gif', 'image/jpeg', 'image/png'].`);

    return await Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const fileReader = new FileReader();
          fileReader.onloadend = () => resolve(fileReader.result);
          fileReader.readAsDataURL(file);
        });
      }),
    );
  };

  const handleFileChange = async (event) => {
    console.log(event.target.files);
    if (!event.target.files) return;
    const files = Object.keys(event.target.files).map((key) => {
      if (key !== 'length') return event.target.files[key];
    });
    const urls = await getUrlsByFileReader(files);
    setImgs(files);
    setUrlImgs(urls);
  };

  const handleCreatePost = () => {
    var bodyFormData = new FormData();
    bodyFormData.append('category', category);
    bodyFormData.append('title', title);
    imgs.forEach((img) => {
      bodyFormData.append('images', img);
    });
    setTitle('');
    setCategory('');
    setImgs();
    setUrlImgs([]);
    try {
      crxFetch
        .post(appConfig.post, bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          console.log(res);
          const newPost = {
            ...res.data.data.post,
            images: JSON.parse(res.data.data.post.images),
            user: {
              avatar: user.avatar,
              name: user.name,
            },
          };

          console.log([newPost, ...posts]);
          setPosts([newPost, ...posts]);
          setOpen(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box className="model">
        <h3>Tạo bài viết</h3>
        <div className={cx('info')} style={{ display: 'flex' }}>
          <Avatar alt="Remy Sharp" src={user.avatar} sx={{ width: 40, height: 40 }} />
          <div className={cx('item_info')} style={{ textAlign: 'initial', marginLeft: '6px' }}>
            <p className={cx('nickname')}>
              <strong style={{ marginRight: '4px' }}>{user.name}</strong>
              <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} style={{ color: '#1565c0' }} />
            </p>
            <p className={cx('name')}>{user.email}</p>
          </div>
        </div>

        <div className="autocomplete">
          <Autocomplete
            value={category}
            onInputChange={(event, newInputValue) => {
              setCategory(newInputValue);
            }}
            disablePortal
            size="large"
            id="combo-box-demo"
            options={optionsCategory}
            style={{ width: '100%', marginTop: '24px', fontSize: '16px' }}
            renderInput={(params) => (
              <TextField {...params} inputProps={{ ...params.inputProps, style: { fontSize: 16 } }} label="Category" />
            )}
          />
        </div>

        <Textarea
          autoFocus
          maxRows={5}
          label="Outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title..."
          style={{ '--Textarea-focusedHighlight': 'none', border: 'none' }}
          sx={{
            width: '100%',
            fontSize: '20px',
            px: 1.5,
            pt: '24px',
            pb: 4,
            lineHeight: '18px',
          }}
        />

        <div className="wrap-imgs">
          <input
            ref={refFiles2}
            type="file"
            multiple
            id="fileImg"
            onChange={(e) => handleFileChange(e)}
            style={{ display: 'none' }}
          />

          {urlImgs &&
            urlImgs.map((urlImg, index) => (
              <div key={index}>
                <img
                  src={urlImg}
                  style={{
                    width: '100%',
                    border: '1px solid #c9b7b7',
                    borderRadius: '6px',
                  }}
                />

                <FontAwesomeIcon
                  onClick={() => {
                    setUrlImgs([]);
                    setImgs();
                    refFiles1.current.value = '';
                    refFiles2.current.value = '';
                  }}
                  icon={faClose}
                  style={{ right: '6px' }}
                  className="iconCloseSubMes"
                />
              </div>
            ))}

          {!urlImgs.length && (
            <div className="wrap-add-photo">
              <label htmlFor="fileImg">
                <AddToPhotosIcon style={{ fontSize: '36px', cursor: 'pointer', padding: '6px' }} />
              </label>
              <div className="add-img">Thêm ảnh</div>
            </div>
          )}
        </div>

        <div className="wrap-add-img">
          <div className="title-add-img">Thêm vào bài viết của bạn</div>
          <input
            ref={refFiles1}
            type="file"
            multiple
            id="fileImg"
            onChange={(e) => handleFileChange(e)}
            style={{ display: 'none' }}
          />
          <label htmlFor="fileImg">
            <FontAwesomeIcon icon={faCamera} className="icon-add-img" />
          </label>
        </div>
        <div>
          <Button style={{ width: '100%', fontSize: '14px' }} variant="contained" onClick={handleCreatePost}>
            Đăng
          </Button>
        </div>
        <FontAwesomeIcon onClick={() => setOpen(false)} icon={faClose} className="iconCloseModel" />
      </Box>
    </Modal>
  );
};
