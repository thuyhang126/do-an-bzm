import {
  faThumbsUp,
  faMessage,
  faUserGroup,
  faArrowRightLong,
  faCamera,
  faClose,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SendIcon from '@mui/icons-material/Send';
import { useState, useEffect } from 'react';
import { Avatar, Box, Grid, Button, ImageList, ImageListItem } from '@mui/material';
import Textarea from '@mui/joy/Textarea';
import appConfig from '../../../config/appConfig';
import { useCrxFetch } from '../../../hooks/useCrxFetch';
import { Comment } from './Comment';
import './index.css';
import './Comment/index.css';

export const ListPost = (post) => {
  const images = post.data.images;

  const [comments, setComments] = useState([]);
  const [title, setTitle] = useState('');
  const [user, setUser] = useState(post.data.user);
  const [counts, setCounts] = useState({});
  const [still, setStill] = useState(false);
  const [page, setPage] = useState(1);
  const [urlImg, setUrlImg] = useState('');
  const [dataImg, setDataImg] = useState();

  const crxFetch = useCrxFetch();

  const getComment = () => {
    try {
      crxFetch
        .post(appConfig.getAllComment, {
          postId: post.data.id,
          page,
        })
        .then((res) => {
          setComments([...comments, ...res.data.data.comments]);
          setUser({ ...user, userId: res.data.data.userId });
          if (res.data.data.comments.length === +appConfig.limitPost) {
            crxFetch
              .post(appConfig.getFirstComment, {
                postId: post.data.id,
              })
              .then((response) => {
                if (res.data.data.comments[+appConfig.limitPost - 1].id !== response.data.data.firstComment.id) {
                  setPage(page + 1);
                  if (still === false) {
                    setStill(true);
                  }
                } else {
                  if (still === true) {
                    setStill(false);
                  }
                }
              });
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = () => {
    if (counts.isLike) {
      setCounts({
        countLike: counts.countLike - 1,
        countComment: counts.countComment,
        isLike: !counts.isLike,
      });
      try {
        crxFetch
          .delete(appConfig.like, {
            data: {
              post_id: post.data.id,
            },
          })
          .then((res) => {
            return res;
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      setCounts({
        countLike: counts.countLike + 1,
        countComment: counts.countComment,
        isLike: !counts.isLike,
      });
      try {
        crxFetch
          .post(appConfig.like, {
            post_id: post.data.id,
          })
          .then((res) => {
            return res;
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleOnPressComment = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleComment();
    }
  };

  const handleComment = () => {
    if (title) {
      var bodyFormData = new FormData();
      bodyFormData.append('post_id', post.data.id);
      bodyFormData.append('title', title);
      bodyFormData.append('likes', JSON.stringify([]));
      bodyFormData.append('images', dataImg);
      setTitle('');
      setDataImg();
      setUrlImg('');
      try {
        crxFetch
          .post(appConfig.apiComment, bodyFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            const newComment = {
              ...res.data.data.comment,
              user,
            };
            setComments([{ ...newComment, likes: JSON.parse(newComment.likes) }, ...comments]);
            setPage(page + 1);
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleFileChange = async (event) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const validImageTypes = [`image/gif`, `image/jpeg`, `image/png`];
    if (!validImageTypes.includes(file.type))
      return alert(`Please select an image in the correct format ['image/gif', 'image/jpeg', 'image/png'].`);
    setDataImg(file);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
      const url = fileReader.result;
      setUrlImg(url);
    };
  };

  useEffect(() => {
    try {
      crxFetch
        .post(appConfig.getCountLikeAndComment, {
          post_id: post.data.id,
        })
        .then((res) => {
          setCounts(res.data.data.counts);
        });
    } catch (err) {
      console.log(err);
    }

    getComment();
  }, []);

  return (
    <Box sx={{ flexDirection: 'column', my: 4, bgcolor: '#f8f4f4', borderRadius: '8px', color: '#333' }}>
      {/* avatar */}
      <Box sx={{ flexDirection: 'row', my: 2, px: 2 }}>
        <Grid container spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" src={post.data.user.avatar} sx={{ width: 48, height: 48, mr: 1.5 }} />
          </Grid>
          <Grid sx={{ pt: 2 }}>
            <Box sx={{ flexDirection: 'column', height: 48, color: '#333' }}>
              <Box sx={{ fontWeight: 800 }}>{post.data.user.name}</Box>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                10 phút
                <Box sx={{ fontSize: 12, ml: 1, color: 'gray', mb: '3px' }}>
                  <FontAwesomeIcon icon={faUserGroup} color="gray" />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* title */}
      <Box sx={{ color: '#333 !important', px: 2 }}>{post.data.title}</Box>

      {/* images */}
      {images[0] && images.length === 1 && (
        <ImageList sx={{ width: '100%', mt: 2, px: 0 }} cols={1}>
          <ImageListItem>
            <img
              src={`${appConfig.portServer}${images[0]}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${appConfig.portServer}${images[0]}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={images[0]}
              loading="lazy"
            />
          </ImageListItem>
        </ImageList>
      )}

      {images.length === 2 && (
        <ImageList sx={{ width: '100%', mt: 2, px: 0 }} cols={2}>
          {images.map((item, i) => (
            <ImageListItem key={i}>
              <img
                src={`${appConfig.portServer}${item}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${appConfig.portServer}${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {images.length > 2 && (
        <ImageList sx={{ width: '100%', height: 550, mt: 2, px: 0 }} cols={2} rowHeight={240}>
          {images.map((item, i) => (
            <ImageListItem key={i}>
              <img
                src={`${appConfig.portServer}${item}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${appConfig.portServer}${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {/* count like */}
      <Box className="countLike">
        <Box sx={{ display: 'flex', color: 'blue', px: 3 }}>
          <Box sx={{ alignItems: 'center' }}>
            <FontAwesomeIcon icon={faThumbsUp} />
          </Box>
          <Box sx={{ display: 'flex', px: 0.5 }}>{counts.countLike}</Box>
        </Box>
        <Box sx={{ display: 'flex', px: 3 }}>{counts.countComment} bình luận</Box>
      </Box>

      {/* post and like */}
      <Box className="wrapPostAndLike">
        <Box sx={{ width: '50%', textAlign: 'center' }}>
          {counts.isLike ? (
            <Button variant="text" sx={{ fontSize: 11, color: 'blue', width: '100%' }} onClick={() => handleLike()}>
              <Box sx={{ fontSize: 20, marginRight: 1 }}>
                <FontAwesomeIcon icon={faThumbsUp} mr={1} />
              </Box>
              Thích
            </Button>
          ) : (
            <Button variant="text" sx={{ fontSize: 11, color: 'black', width: '100%' }} onClick={() => handleLike()}>
              <Box sx={{ fontSize: 20, marginRight: 1 }}>
                <FontAwesomeIcon icon={faThumbsUp} mr={1} />
              </Box>
              Thích
            </Button>
          )}
        </Box>
        <Box sx={{ width: '50%', textAlign: 'center' }}>
          <Button variant="text" sx={{ fontSize: 11, color: 'black', width: '100%' }}>
            <Box sx={{ fontSize: 20, marginRight: 1 }}>
              <FontAwesomeIcon icon={faMessage} mr={1} />
            </Box>
            Bình luận
          </Button>
        </Box>
      </Box>

      {/* post detail */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Grid container>
          <Grid item>
            <Avatar alt="Remy Sharp" src={post.data.user.avatar} sx={{ width: 40, height: 40, mr: 1.5 }} />
          </Grid>
          <Grid item xs={10.5} sx={{ position: 'relative' }} onKeyPress={(e) => handleOnPressComment(e)}>
            <Textarea
              label="Outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bình luận…"
              sx={{
                border: '1px solid #d5c8c8',
                width: '100%',
                fontSize: '15px',
                pt: '8px',
                pb: '40px',
              }}
            />
            <input type="file" id={post.data.id} onChange={(e) => handleFileChange(e)} style={{ display: 'none' }} />
            <label htmlFor={post.data.id}>
              <FontAwesomeIcon icon={faCamera} className="iconCamera" />
            </label>
            <SendIcon onClick={() => handleComment()} className="iconSend" />
          </Grid>
          {urlImg && (
            <div style={{ position: 'relative' }}>
              <img
                src={urlImg}
                style={{ height: '100px', marginTop: '10px', marginLeft: '60px', border: '1px solid #c9b7b7' }}
              />
              <FontAwesomeIcon
                onClick={() => {
                  setUrlImg('');
                  setDataImg();
                }}
                icon={faClose}
                className="iconClose"
              />
            </div>
          )}
        </Grid>
      </Box>

      {comments.length > 0 &&
        comments.map((comment, i) => <Comment key={i} data={{ comment, user, countComment: comments.length }} />)}

      {still && (
        <Button
          variant="text"
          sx={{ fontSize: 14, color: '#444', textTransform: 'none', mt: -1 }}
          onClick={() => getComment()}
        >
          <FontAwesomeIcon icon={faArrowRightLong} />
          <Box sx={{ ml: 0.5 }}>Xem thêm phản hồi</Box>
        </Button>
      )}
    </Box>
  );
};
