import * as React from 'react';
import { useState, useRef, useEffect, useContext } from 'react';
import { Avatar, Box, Button, Grid } from '@mui/material';
import { faXmark, faCircleCheck, faCamera, faClose, faVideo } from '@fortawesome/free-solid-svg-icons';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Textarea from '@mui/joy/Textarea';
import { IconButton } from '@mui/material';
import JsxParser from 'react-jsx-parser';
import Moment from 'react-moment';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { SocketContext } from '../../../context/socketContext';
import { useCrxFetch } from '../../../hooks/useCrxFetch';
import appConfig from '../../../config/appConfig';
import './index.css';

const mdParser = require('markdown-it')({
  xhtmlOut: true,
});

const WindowMessage = (props) => {
  const { dataWindow, windowMessages, setWindowMessages } = props.data;
  const socket = useContext(SocketContext).socket;
  const crxFetch = useCrxFetch();
  const user = useContext(SocketContext).user;

  const messageId = useRef(-1);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [messageIdPage, setMessageIdPage] = useState(-1);
  const [still, setStill] = useState(true);
  const [urlImgs, setUrlImgs] = useState([]);
  const [imgs, setImgs] = useState();
  const [open, setOpen] = useState(false);
  const [idMessageDelete, setIdMessageDelete] = useState('');

  const messagesEndRef = useRef(null);
  const firstMessage = useRef(null);
  const messageNormal = useRef(null);

  const getMessages = async () => {
    if (!still) return;
    try {
      crxFetch
        .post(appConfig.getMessage, {
          receiver_id: dataWindow.receiver_id,
          message_id: messageIdPage === -1 ? null : messageIdPage,
        })
        .then((res) => {
          const dataMessages = formatMessages(res.data.data.messageList).reverse();
          const newMessages = [...dataMessages, ...messages];
          setMessages(newMessages);
          if (res.data.data.messageList.length < +appConfig.limitMessage) {
            setStill(false);
          } else {
            setMessageIdPage(newMessages[0].id);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const formatMessages = (messages) => {
    messages.forEach((mes, i) => {
      if (i === 0) {
        messageId.current = mes.sender_id;
        if (mes.sender_id === user.id) {
          mes.seen_at ? (mes.lastSent = true) : (mes.last = true);
        } else {
          mes.lastYou = true;
        }
      } else {
        if (mes.sender_id === messageId.current) {
          messages[i - 1].last ? (mes.last = true) : (mes.sameId = true);
        } else {
          mes.sameId = false;
          mes.first = true;
          messageId.current = mes.sender_id;
        }
      }
    });
    return messages;
  };

  const apiSentMessageImgs = async (receiver_id) => {
    var bodyFormData = new FormData();
    bodyFormData.append('receiver_id', receiver_id);
    imgs.forEach((img) => {
      bodyFormData.append('images', img);
    });
    setImgs();
    setUrlImgs([]);
    try {
      crxFetch
        .post(appConfig.sentMessage, bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          return socket.emit('message', {
            type: 'file',
            ...res.data.data.message,
            sender_name: user.name,
            sender_avatar: user.avatar,
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteMessage = () => {
    socket.emit('delete-message', { id: idMessageDelete, sender_id: user.id, receiver_id: dataWindow.receiver_id });
    setIdMessageDelete('');
  };

  const handleSentMessage = async () => {
    if (message !== '') {
      socket.emit('message', {
        receiver_id: dataWindow.receiver_id,
        sender_id: user.id,
        sender_name: user.name,
        sender_avatar: user.avatar,
        message,
      });
    }

    console.log('imgs', imgs);
    if (imgs) {
      console.log(1);
      const newMessage = await apiSentMessageImgs(dataWindow.receiver_id);
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (message === '' && !imgs[0]) return;
      else {
        handleSentMessage();
      }
    }
  };

  const handleCloseWindowMessage = (receiver_id) => {
    setWindowMessages(windowMessages.filter((item) => item.receiver_id !== receiver_id));
  };

  const handleScroll = async (event) => {
    if (event.currentTarget.scrollTop === 0) {
      console.log('calling');
      await getMessages();
      if (still) {
        firstMessage.current?.scrollIntoView();
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  useEffect(() => {
    if (socket) {
      socket.on('sent-message', (data) => {
        console.log(data);
        //format css message
        const newMessage = {
          id: data.id,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          sent_at: data.sent_at,
          message: data.message,
        };

        if (data.sender_id !== user.id) {
          messages.forEach((item) => {
            if (item.lastSent) delete item.lastSent;
            return item;
          });
        }

        //check message before has same id
        if (
          messages.length &&
          messages[messages.length - 1].sender_id === data.sender_id &&
          data.sender_id !== user.id
        ) {
          delete messages[messages.length - 1].first;
          messages[messages.length - 1].sameId = true;
          newMessage.first = true;
        } else if (
          messages.length &&
          messages[messages.length - 1].sender_id !== data.sender_id &&
          data.sender_id !== user.id
        ) {
          newMessage.first = true;
          newMessage.sameId = false;
        } else if (messages.length && data.sender_id === user.id) {
          newMessage.new = true;
        }
        setMessages([...messages, newMessage]);
        setMessage('');
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      });

      socket.on('update-seen-message', (data) => {
        const messageLast = data.reverse()[0];
        const newMessages = messages.map((item) => {
          if (item.new) {
            delete item.new;
            if (item.id === messageLast.id) {
              item.seen_at = messageLast.seen_at;
              item.lastSent = true;
            }
          }
          return item;
        });
        setMessages(newMessages);
      });

      socket.on('update-message-delete', (id) => {
        setMessages(messages.filter((message) => message.id !== id));
        setOpen(false);
      });

      return () => {
        socket.off('sent-message');
        socket.off('update-seen-message');
        socket.off('update-message-delete');
      };
    }
  }, [socket, messages]);

  useEffect(() => {
    getMessages();
    setTimeout(() => {
      scrollToBottom();
    }, 200);
  }, []);

  return (
    <>
      <Box className="windowMessage">
        {/* avatar */}
        <Box className="wrap-avatar">
          <Grid container spacing={2}>
            <Grid item sx={{ ml: -1, mt: -1 }}>
              <Avatar alt="Remy Sharp" src={dataWindow.avatar} sx={{ width: 32, height: 32, mr: 1.5 }} />
            </Grid>
            <Grid sx={{ pt: 1 }}>
              <Box className="wrap-attribute-avatar">
                <Box sx={{ fontWeight: 800 }}>{dataWindow.name}</Box>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>10 phút</Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box className="icon-close" onClick={() => handleCloseWindowMessage(dataWindow.receiver_id)}>
          <FontAwesomeIcon icon={faXmark} color="#fff" />
        </Box>
        <Box className="icon-call" onClick={() => handleCloseWindowMessage(dataWindow.receiver_id)}>
          <FontAwesomeIcon icon={faVideo} color="#fff" />
        </Box>
        {/* message */}
        <Box className="wrap-messages" onScroll={handleScroll}>
          {messages.map((mes, i) => (
            <Box
              key={i}
              sx={{ flexDirection: 'row', my: 2, px: 2, pr: 0, color: 'fff' }}
              ref={i === 18 ? firstMessage : messageNormal}
            >
              {mes.sender_id === dataWindow.receiver_id && (
                <Grid container spacing={2} sx={{ alignItems: 'end' }}>
                  <Grid item sx={{ ml: -1, mt: -1, display: mes.sameId && 'none', mb: 1.5 }}>
                    <Avatar alt="Remy Sharp" src={dataWindow.avatar} sx={{ width: 28, height: 28, mr: 1.5 }} />
                  </Grid>
                  <Grid
                    item
                    xs={8.5}
                    sx={{
                      ml: '-20px',
                      pt: '1px !important',
                      pl: mes.sameId && '64px !important',
                      mb: (mes.first || mes.lastYou) && '12px !important',
                      position: 'relative',
                    }}
                  >
                    <Box className="you">
                      <JsxParser jsx={mdParser.render(mes.message)} />
                      <Moment className="timeYou" fromNow ago style={{ left: mes.first ? '16px' : '65px' }}>
                        {mes.sent_at}
                      </Moment>
                    </Box>
                  </Grid>
                </Grid>
              )}
              {mes.sender_id === user.id && (
                <Grid container spacing={2} sx={{ alignItems: 'end', flexDirection: 'row-reverse' }}>
                  <Grid
                    item
                    xs={8.5}
                    sx={{
                      ml: '-20px',
                      pt: '1px !important',
                      mr: 2,
                      display: 'flex',
                      justifyContent: 'end',
                      mb: mes.first && '12px !important',
                      alignItems: 'end',
                    }}
                  >
                    <Box className="me">
                      <JsxParser jsx={mdParser.render(mes.message)} />
                      <Moment className="timeMe" fromNow ago>
                        {mes.sent_at}
                      </Moment>
                      <DeleteOutlineIcon
                        onClick={() => {
                          setIdMessageDelete(mes.id);
                          setOpen(true);
                        }}
                        className="iconDelete"
                      ></DeleteOutlineIcon>
                    </Box>
                    {mes.lastSent && (
                      <Box sx={{ position: 'absolute', right: '-15px', fontSize: '14px' }}>
                        <Avatar alt="Remy Sharp" src={user.avatar} sx={{ width: 14, height: 14 }} />
                      </Box>
                    )}
                    {(mes.last || mes.new) && (
                      <Box sx={{ position: 'absolute', right: '-15px', fontSize: '14px' }}>
                        <FontAwesomeIcon icon={faCircleCheck} color="#c1b6b6" />
                      </Box>
                    )}
                  </Grid>
                </Grid>
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* input */}
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <Grid container spacing={2} sx={{ alignItems: 'center', backgroundColor: '#f0f0f0' }}>
            <Grid item xs={12} sx={{ display: 'flex', pt: '0px !important', marginBottom: '4px' }}>
              <div className="wrapCameraMes">
                <input
                  type="file"
                  multiple
                  id="fileImg"
                  onChange={(e) => handleFileChange(e)}
                  style={{ display: 'none' }}
                />
                <label htmlFor="fileImg">
                  <FontAwesomeIcon icon={faCamera} className="iconCameraMessage" />
                </label>
              </div>
              <div className="wrapInputMes">
                <div className="scrollMessage">
                  {urlImgs &&
                    urlImgs.map((urlImg, index) => (
                      <div key={index} style={{ position: 'relative', display: 'inline-block', marginLeft: '10px' }}>
                        <img
                          src={urlImg}
                          style={{
                            height: '66px',
                            marginTop: '10px',
                            border: '1px solid #c9b7b7',
                            borderRadius: '6px',
                          }}
                        />
                        <FontAwesomeIcon
                          onClick={() => {
                            setUrlImgs([]);
                            setImgs();
                          }}
                          icon={faClose}
                          className="iconCloseSubMes"
                        />
                      </div>
                    ))}
                </div>
                <Textarea
                  autoFocus
                  onFocus={() => socket.emit('seen_messages', dataWindow.receiver_id)}
                  maxRows={5}
                  label="Outlined"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => handleEnter(e)}
                  placeholder="Aa…"
                  style={{ '--Textarea-focusedHighlight': 'none', border: 'none' }}
                  sx={{
                    width: '100%',
                    fontSize: '14px',
                    px: 1.5,
                    py: '7px',
                    pt: '11px',
                    lineHeight: '18px',
                  }}
                />
              </div>
              <IconButton onClick={handleSentMessage}>
                <SendIcon sx={{ fontSize: '24px' }} />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete message!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete the message?
          </Typography>
          <Grid sx={{ mt: 2 }}>
            <Button onClick={() => handleDeleteMessage()} variant="contained" color="error" sx={{ mr: 2 }}>
              Yes
            </Button>
            <Button onClick={() => setOpen(false)} variant="contained" sx={{ ml: 2 }}>
              No, Thanks
            </Button>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default WindowMessage;
