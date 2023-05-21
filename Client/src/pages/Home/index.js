import { Post } from './Post';
import { useEffect, useState } from 'react';
import appConfig from '../../config/appConfig';
import { useCrxFetch } from '../../hooks/useCrxFetch';

export default () => {
  const [posts, setPosts] = useState([]);
  const [still, setStill] = useState(false);
  const [page, setPage] = useState(1);

  const crxFetch = useCrxFetch();

  const getPost = () => {
    try {
      crxFetch
        .post(appConfig.getAllPost, {
          page,
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
    getPost();
  }, []);
  return <Post posts={posts} getPost={getPost} still={still} />;
};
