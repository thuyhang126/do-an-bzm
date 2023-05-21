import { faArrowRightLong, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Box, Grid, Button } from '@mui/material';
import JsxParser from 'react-jsx-parser';
import appConfig from '../../../../config/appConfig';
import { useCrxFetch } from '../../../../hooks/useCrxFetch';
import InputComment from './inputComment';
import './index.css';

const mdParser = require('markdown-it')({
  xhtmlOut: true,
});

const CommentComponent = (data) => {
  const { userId, avatar } = data.data.user;
  let dataComment = { ...data.data.comment, likes: data.data.comment.likes ? data.data.comment.likes : [] };

  const [comment, setComment] = useState({});
  const [commentFix, setCommentFix] = useState({});
  const [titleNewCmtSub, setTitleNewCmtSub] = useState('');
  const [commentSubs, setCommentSubs] = useState([]);
  const [still, setStill] = useState(false);
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState(false);
  const [urlImg, setUrlImg] = useState('');
  const [dataImg, setDataImg] = useState();

  const inputComment = useRef();

  const crxFetch = useCrxFetch();

  const getCommentSub = async (times) => {
    let dataCommentSubs = commentSubs;
    if (times === 'first') {
      dataCommentSubs = [];
    }
    try {
      await crxFetch
        .post(appConfig.getAllComment, {
          postId: dataComment.post_id,
          rank: 1,
          belong: dataComment.id,
          page,
        })
        .then((res) => {
          let commentSubsNew = [...res.data.data.comments];
          commentSubsNew.forEach((commentSub, i) => {
            if (commentSub.likes) {
              commentSubsNew[i] = { ...commentSub, likes: commentSub.likes };
            }
          });
          setCommentSubs([...dataCommentSubs, ...commentSubsNew]);
          if (res.data.data.comments.length === +appConfig.limitPost) {
            crxFetch
              .post(appConfig.getFirstComment, {
                postId: dataComment.post_id,
                rank: 1,
                page: page + 1,
                belong: dataComment.id,
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

  const apiUpdateCmt = (data, feat) => {
    console.log(data.likes);
    var bodyFormDataUpdateComment = new FormData();
    bodyFormDataUpdateComment.append('id', data.id);
    bodyFormDataUpdateComment.append('likes', JSON.stringify(data.likes));
    if (!feat) {
      bodyFormDataUpdateComment.append('title', data.title);
      bodyFormDataUpdateComment.append('images', dataImg);
    }
    try {
      crxFetch
        .post(appConfig.apiUpdateComment, bodyFormDataUpdateComment, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          return res;
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = (e) => {
    const id = +e.target.id;
    const name = e.target.name;
    const commentLikes = comment.likes;
    let newCommentSubs, commentSubLikes, newLikes, index;

    switch (name) {
      case 'cmt':
        newLikes = commentLikes?.length > -1 ? [...commentLikes, userId] : [userId];
        apiUpdateCmt({ id, likes: newLikes }, 'likeCmt');
        setComment({ ...comment, likes: newLikes });
        break;

      case 'cmtLiked':
        newLikes = commentLikes;
        index = newLikes.findIndex((like) => like === userId);
        newLikes.splice(index, 1);
        apiUpdateCmt({ id, likes: newLikes }, 'unlikeCmt');
        setComment({ ...comment, likes: newLikes });
        break;

      case 'cmtSub':
        newCommentSubs = commentSubs;
        newCommentSubs.forEach((commentSub, i) => {
          if (commentSub.id === id) {
            commentSubLikes = commentSub.likes;
            newLikes = commentSubLikes?.length > -1 ? (newLikes = [...commentSubLikes, userId]) : [userId];
            newCommentSubs[i].likes = newLikes;
          }
        });
        apiUpdateCmt({ id, likes: newLikes }, 'likeCmtSub');
        setCommentSubs([...newCommentSubs]);
        break;

      case 'cmtSubLiked':
        newCommentSubs = commentSubs;
        newCommentSubs.forEach((commentSub, i) => {
          if (commentSub.id === id) {
            commentSubLikes = commentSub.likes;
            index = commentSubLikes.findIndex((subLike) => subLike === userId);
            newLikes = commentSubLikes;
            newLikes.splice(index, 1);
            newCommentSubs[i].likes = newLikes;
          }
        });
        apiUpdateCmt({ id, likes: newLikes }, 'unlikeCmtSub');
        setCommentSubs([...newCommentSubs]);
        break;
      default:
    }
  };

  const handleFeedback = (e) => {
    setFeedback(true);
    document.getElementById(e.target.name)?.querySelector('textarea')?.focus();
  };

  const handleFixCmt = (data) => {
    if (data.title.includes('![](')) {
      setUrlImg(data.title.slice(data.title.lastIndexOf('![](') + 4, -1));
      setCommentFix({ ...data, title: data.title.slice(0, data.title.lastIndexOf('![](')) });
    } else {
      setCommentFix(data);
    }
  };

  const handleSaveFixCmt = () => {
    if (commentFix.title === '') {
      alert('Hãy nhập bình luận! Nhấn Hủy để thoát!');
    } else {
      if (!dataImg && urlImg) commentFix.title += `![](${urlImg})`;
      apiUpdateCmt(commentFix);
      setComment({ ...comment, title: urlImg ? commentFix.title + `![](${urlImg})` : commentFix.title });
      setCommentFix({});
    }
  };

  const handleSaveFixCmtSub = () => {
    if (commentFix.title === '') {
      alert('Hãy nhập bình luận! Nhấn Hủy để thoát!');
    } else {
      if (!dataImg && urlImg) commentFix.title += `![](${urlImg})`;
      apiUpdateCmt(commentFix);
      commentSubs.forEach((commentSub, i) => {
        if (commentSub.id === commentFix.id) {
          return (commentSubs[i].title = urlImg ? commentFix.title + `![](${urlImg})` : commentFix.title);
        }
      });
      setCommentSubs([...commentSubs]);
      setCommentFix({});
    }
  };

  const handleOnPressComment = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveFixCmt();
    }
  };

  const handleOnPressCommentSub = (e) => {
    console.log('fix subcmt');
    console.log(e.key, data);
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveFixCmtSub();
    }
  };

  const handleOnPressCreateCommentSub = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommentSub();
    }
  };

  const handleCommentSub = () => {
    if (titleNewCmtSub) {
      var bodyFormData = new FormData();
      bodyFormData.append('post_id', comment.post_id);
      bodyFormData.append('title', titleNewCmtSub);
      bodyFormData.append('images', dataImg);
      bodyFormData.append('belong', comment.id);
      bodyFormData.append('rank', 1);
      bodyFormData.append('likes', JSON.stringify([]));
      setTitleNewCmtSub('');
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
            setCommentSubs([
              { ...res.data.data.comment, likes: JSON.parse(res.data.data.comment.likes), user: data.data.user },
              ...commentSubs,
            ]);
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getUrlByFileReader = async (file) => {
    const validImageTypes = [`image/gif`, `image/jpeg`, `image/png`];
    if (!validImageTypes.includes(file.type))
      return alert(`Please select an image in the correct format ['image/gif', 'image/jpeg', 'image/png'].`);
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => resolve(fileReader.result);
      fileReader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const url = await getUrlByFileReader(file);
    setDataImg(file);
    setUrlImg(url);
  };

  useEffect(() => {
    setComment(dataComment);
    getCommentSub('first');
  }, [data.data.countComment]);

  return (
    <Box id={`post${comment.id}`} sx={{ flexDirection: 'row', px: 2, py: 0 }}>
      <Grid container spacing={2}>
        <Grid item>
          <Avatar alt="Remy Sharp" src={comment.user?.avatar} sx={{ width: 40, height: 40 }} />
        </Grid>
        <Grid item xs={10.5} sx={{ ml: -1 }}>
          {commentFix.id !== comment.id && (
            <Box className="wrapTitleComment">
              <Box sx={{ fontWeight: 800 }}>{comment.user?.name}</Box>
              <Box className="titleComment" sx={{ position: 'relative' }}>
                {comment?.title && <JsxParser jsx={mdParser.render(comment.title)} />}
                <Box className="wrapImgComment">
                  <img
                    style={{ height: '18px' }}
                    src={
                      "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e"
                    }
                  />
                  <Box sx={{ ml: '3px' }}>{comment.likes?.length ? comment.likes?.length : 0}</Box>
                </Box>
              </Box>
            </Box>
          )}
          {commentFix.id === comment.id && (
            <InputComment
              refInput={inputComment}
              handleOnPress={handleOnPressComment}
              setCommentFix={setCommentFix}
              commentFix={commentFix}
              title={commentFix.title}
              handleChange={handleFileChange}
              handleComment={handleSaveFixCmt}
              idComment={'FixCmt' + comment.id}
              urlImg={urlImg}
              setUrlImg={setUrlImg}
              setDataImg={setDataImg}
            />
          )}
          <Box sx={{ display: 'flex' }}>
            {comment.likes?.includes(userId) ? (
              <Button
                id={comment.id}
                name="cmtLiked"
                variant="text"
                sx={{ fontSize: 11, color: 'blue' }}
                onClick={(e) => handleLike(e)}
              >
                Thích
              </Button>
            ) : (
              <Button
                id={comment.id}
                name="cmt"
                variant="text"
                sx={{ fontSize: 11, color: '#333' }}
                onClick={(e) => handleLike(e)}
              >
                Thích
              </Button>
            )}
            <Button
              variant="text"
              sx={{ fontSize: 11, color: '#333' }}
              name={`post${comment.id}`}
              onClick={(e) => handleFeedback(e)}
            >
              Phản hồi
            </Button>
            <Button variant="text" sx={{ fontSize: 11, color: '#333' }}>
              Time
            </Button>
            {comment.commenter_id === userId && commentFix.id !== comment.id && (
              <Button
                variant="text"
                sx={{ fontSize: 11, color: '#333' }}
                onClick={(e) => handleFixCmt({ title: comment.title, id: comment.id, likes: comment.likes })}
              >
                Chỉnh sửa
              </Button>
            )}
            {comment.commenter_id === userId && commentFix.id === comment.id && (
              <Button
                variant="text"
                sx={{ fontSize: 11, color: '#333' }}
                onClick={(e) => setCommentFix({ ...commentFix, id: -1 })}
              >
                Hủy
              </Button>
            )}
          </Box>

          {commentSubs.length > 0 &&
            commentSubs.map((commentSub, i) => (
              <Grid container spacing={2} mt={-1.5} key={i}>
                <Grid item xs={1}>
                  <Avatar alt="Remy Sharp" src={commentSub.user.avatar} sx={{ width: 32, height: 32 }} />
                </Grid>
                <Grid item xs={11} sx={{ ml: -1 }}>
                  {commentFix.id !== commentSub.id && (
                    <Box className="wrapTitleComment">
                      <Box sx={{ fontWeight: 800 }}>{commentSub.user.name}</Box>
                      <Box sx={{ position: 'relative' }}>
                        <Box className="subTitle">
                          <JsxParser jsx={mdParser.render(commentSub.title)} />
                          <Box className="wrapImgComment">
                            <img
                              style={{ height: '18px' }}
                              src={
                                "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e"
                              }
                            />
                            <Box sx={{ ml: '3px' }}>{commentSub.likes?.length ? commentSub.likes.length : 0}</Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}
                  {commentFix.id === commentSub.id && (
                    <InputComment
                      refInput={inputComment}
                      handleOnPress={handleOnPressCommentSub}
                      setCommentFix={setCommentFix}
                      commentFix={commentFix}
                      title={commentFix.title}
                      handleChange={handleFileChange}
                      handleComment={handleSaveFixCmtSub}
                      idComment={'EditSubCmt' + commentSub.id}
                      urlImg={urlImg}
                      setUrlImg={setUrlImg}
                      setDataImg={setDataImg}
                    />
                  )}
                  <Box sx={{ display: 'flex' }}>
                    {commentSub.likes?.includes(userId) ? (
                      <Button
                        id={commentSub.id}
                        name="cmtSubLiked"
                        variant="text"
                        sx={{ fontSize: 11, color: 'blue' }}
                        onClick={(e) => handleLike(e)}
                      >
                        Thích
                      </Button>
                    ) : (
                      <Button
                        id={commentSub.id}
                        name="cmtSub"
                        variant="text"
                        sx={{ fontSize: 11, color: '#333' }}
                        onClick={(e) => handleLike(e)}
                      >
                        Thích
                      </Button>
                    )}
                    <Button
                      variant="text"
                      sx={{ fontSize: 11, color: '#333' }}
                      name={`post${comment.id}`}
                      onClick={(e) => handleFeedback(e)}
                    >
                      Phản hồi
                    </Button>
                    <Button variant="text" sx={{ fontSize: 11, color: '#333' }}>
                      Time
                    </Button>
                    {commentSub.commenter_id === userId && commentFix.id !== commentSub.id && (
                      <Button
                        variant="text"
                        sx={{ fontSize: 11, color: '#333' }}
                        onClick={(e) =>
                          handleFixCmt({ title: commentSub.title, id: commentSub.id, likes: commentSub.likes })
                        }
                      >
                        Chỉnh sửa
                      </Button>
                    )}
                    {commentSub.commenter_id === userId && commentFix.id === commentSub.id && (
                      <Button
                        variant="text"
                        sx={{ fontSize: 11, color: '#333' }}
                        onClick={(e) => setCommentFix({ ...commentFix, id: -1 })}
                      >
                        Hủy
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            ))}
          {still && (
            <Button
              variant="text"
              sx={{ fontSize: 14, color: '#444', textTransform: 'none', mt: -1 }}
              onClick={() => getCommentSub()}
            >
              <FontAwesomeIcon icon={faArrowRightLong} />
              <Box sx={{ ml: 0.5 }}>Xem thêm phản hồi</Box>
            </Button>
          )}

          {/* create comment sub */}
          {feedback && (
            <Box sx={{ pb: 2 }}>
              <Grid container>
                <Grid item>
                  <Avatar alt="Remy Sharp" src={avatar} sx={{ width: 32, height: 32, mr: 1.5 }} />
                </Grid>
                <InputComment
                  refInput={inputComment}
                  handleOnPress={handleOnPressCreateCommentSub}
                  feat={'createCmtSub'}
                  setCommentFix={setTitleNewCmtSub}
                  title={titleNewCmtSub}
                  handleChange={handleFileChange}
                  handleComment={handleCommentSub}
                  idComment={'createSubCmt' + comment.id}
                  titleComment={comment.title}
                  urlImg={urlImg}
                  setUrlImg={setUrlImg}
                  setDataImg={setDataImg}
                />
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export const Comment = React.memo(CommentComponent);
