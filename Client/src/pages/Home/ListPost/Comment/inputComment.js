import { Grid } from '@mui/material';
import { faCamera, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SendIcon from '@mui/icons-material/Send';
import Textarea from '@mui/joy/Textarea';

const InputComment = (props) => {
  return (
    <>
      <Grid item xs={10.5} sx={{ mb: 2, position: 'relative' }} ref={props.refInput}>
        <Textarea
          label="Outlined"
          value={props.title}
          onKeyPress={(e) => props.handleOnPress(e)}
          onChange={(e) =>
            props.setCommentFix(props?.feat ? e.target.value : { ...props.commentFix, title: e.target.value })
          }
          placeholder="Bình luận…"
          sx={{
            border: '1px solid #d5c8c8',
            width: '100%',
            fontSize: '15px',
            pt: '8px',
            pb: '40px',
          }}
        />
        <input type="file" id={props.idComment} onChange={(e) => props.handleChange(e)} style={{ display: 'none' }} />
        <label htmlFor={props.idComment}>
          <FontAwesomeIcon icon={faCamera} className="iconCamera" />
        </label>
        <SendIcon onClick={() => props.handleComment(props.commentFix)} className="iconSend" />
      </Grid>
      {props.urlImg && (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={props.urlImg}
            style={{ height: '100px', marginTop: '-10px', marginLeft: '50px', border: '1px solid #c9b7b7' }}
          />
          <FontAwesomeIcon
            onClick={() => {
              props.setUrlImg('');
              props.setDataImg();
            }}
            icon={faClose}
            className="iconCloseSub"
          />
        </div>
      )}
    </>
  );
};

export default InputComment;
