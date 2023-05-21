import { CreatePost } from './createPost';
import { Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import { Post } from '../../Home/Post';
import appConfig from '../../../config/appConfig';
import { useCrxFetch } from '../../../hooks/useCrxFetch';

export const ProfilePost = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [still, setStill] = useState(false);
  const [page, setPage] = useState(1);

  const crxFetch = useCrxFetch();

  const getPost = () => {
    try {
      crxFetch
        .post(appConfig.postByUser, {
          page,
          poster_id: user.id,
        })
        .then((res) => {
          setPosts([...posts, ...res.data.data.posts]);
          if (res.data.data.posts.length === +appConfig.limitPost) {
            crxFetch.post(appConfig.getFirstPost).then((response) => {
              if (res.data.data.posts[+appConfig.limitPost - 1].id !== response.data.data.firstPost.id) {
                if (still === false) {
                  setPage(page + 1);
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

  useEffect(() => {
    if (user.id) getPost();
  }, [user.id]);

  return (
    <>
      <div className="wrap-input-post">
        <Avatar alt="Remy Sharp" src={user.avatar} sx={{ width: 40, height: 40 }} />
        <div onClick={() => setOpen(true)} class="input-post-profile">
          {`${user.name} ơi, bạn đang nghĩ gì thế?`}
        </div>
      </div>

      <CreatePost user={user} setOpen={setOpen} open={open} setPosts={setPosts} posts={posts} />

      <Post posts={posts} getPost={getPost} still={still} />
    </>
  );
};
