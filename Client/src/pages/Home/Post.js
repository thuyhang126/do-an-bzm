import { ListPost } from './ListPost/ListPost';
import Button from '@mui/material/Button';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Post = ({ posts, getPost, still }) => {
  return (
    <div>
      {posts.map((post) => (
        <ListPost key={post.id} data={post} />
      ))}
      {still && (
        <Button
          variant="text"
          sx={{ fontSize: 14, color: '#444', textTransform: 'none', mt: -1 }}
          onClick={() => getPost()}
        >
          <FontAwesomeIcon icon={faArrowRightLong} />
          <Box sx={{ ml: 0.5 }}>Xem thêm bài viết</Box>
        </Button>
      )}
    </div>
  );
};
