import React, {useEffect, useRef, useState, useContext} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import {FlatList} from 'react-native-bidirectional-infinite-scroll';
import {useDispatch, useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

import {API, IMAGE} from '../../constants';
import {useBzFetch} from '../../hooks/useBzFetch';
import BzCustomHeader from '../../components/BzCustomHeader';
import BzInputTextMultiple from '../../components/BzInputTextMultiple';
import {SocketContext} from '../../contexts';
import BzChatMessageItem from '../../components/BzChatMessageItem';
import {RootState} from '../../redux/store';
import {setCurrentScreen} from '../../redux/global/globalStateSlice';

const ChatScreen = () => {
  const route = useRoute<any>();
  const socket = useContext(SocketContext);
  const BzFetch = useBzFetch();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const nextHistoryMessageId = useRef(0);
  const inputRef = useRef<TextInput>(null);

  const [messages, setMessages] = useState<any>([]);
  const [message, setMessage] = useState('');
  const [isLoadMoreProcessing, setIsLoadMoreProcessing] = useState(false);

  const height = 45;
  const chatUser = route.params?.chatUser;

  const loadMoreMessagesHandle = async () => {
    if (!isLoadMoreProcessing) {
      setIsLoadMoreProcessing(true);

      BzFetch.post(API.CHAT_MESSAGE_LIST, {
        receiver_id: chatUser.id,
        message_id: nextHistoryMessageId.current,
      })
        .then(({data: rs}) => {
          setIsLoadMoreProcessing(false);
          if (rs.data.messageList.length) {
            const loadMoreMessages = rs.data.messageList.filter(
              (item: any) => item.message,
            );
            setMessages([...messages, ...loadMoreMessages]);
            nextHistoryMessageId.current =
              rs.data.messageList[rs.data.messageList.length - 1].id;
          }
        })
        .catch(err => console.log(err));
    }
  };

  const sendMessageHandle = () => {
    const refId = uuidv4();

    socket?.emit('message', {
      ref_id: refId,
      receiver_id: chatUser.id,
      sender_id: user.attr.id,
      sender_name: user.name,
      sender_avatar: user.avatar,
      message: message.trim(),
    });

    setMessages((prev: any) => {
      return [
        {
          id: refId,
          message,
          receiver_id: chatUser.id,
          sender_id: user.attr.id,
          sent_at: null,
          seen_at: null,
        },
        ...prev,
      ];
    });

    setMessage('');
  };

  const seenMessagesHandle = async () => {
    socket?.emit('seen_messages', chatUser.id);
  };

  const focusChatInputHandle = () => {
    seenMessagesHandle();
  };

  useEffect(() => {
    const currentScreen = `ChatScreen-${chatUser.id}`;
    dispatch(setCurrentScreen({currentScreen}));

    BzFetch.post(API.CHAT_MESSAGE_LIST, {
      receiver_id: chatUser.id,
    })
      .then(({data: rs}) => {
        setIsLoadMoreProcessing(false);
        if (rs.data.messageList.length) {
          const _messages = rs.data.messageList.filter(
            (item: any) => item.message,
          );
          setMessages(_messages);
          nextHistoryMessageId.current =
            rs.data.messageList[rs.data.messageList.length - 1].id;
        }
      })
      .catch(err => console.log(err));

    return () => {
      dispatch(setCurrentScreen({currentScreen: ''}));
    };
  }, []);

  useEffect(() => {
    socket?.on('sent-message', (payload: any) => {
      if (+payload.sender_id === chatUser.id) {
        setMessages((prev: any) => {
          return [payload, ...prev];
        });
      } else if (+payload.receiver_id === chatUser.id) {
        setMessages((prev: any) => {
          return prev.map((message: any) => {
            if (message.id === payload.ref_id) {
              message.id = payload.id;
              message.sent_at = payload.sent_at;
            }

            return message;
          });
        });
      }
    });

    socket?.on('update-seen-message', (listMessageUpdate: any) => {
      setMessages((prev: any) => {
        let allMessages = prev,
          timeSeen = listMessageUpdate[0].seen_at;
        allMessages.forEach((message: {sender_id: any; seen_at: any}) => {
          if (user.attr.id === message.sender_id) {
            message.seen_at = timeSeen;
          }
        });
        return [...allMessages];
      });
    });

    return () => {
      socket?.off('sent-message');
      socket?.off('update-seen-message');
    };
  }, [socket]);

  return (
    <View style={styles.wrapper}>
      <BzCustomHeader
        titleWrapperStyle={styles.doNotShow}
        rightWrapperStyle={styles.doNotShow}
        user={chatUser}
        showUserName
        showBottomBorder
      />
      <FlatList
        inverted
        enableAutoscrollToTop
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}
        data={messages}
        onEndReached={loadMoreMessagesHandle}
        onStartReached={seenMessagesHandle}
        renderItem={({item}: any) => (
          <BzChatMessageItem
            key={item.id}
            item={item}
            chatUser={chatUser}
            user={user}
          />
        )}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={height}>
        <View>
          {chatUser.deleted_at ? (
            <View style={styles.chatInputWrapper}>
              <Text style={styles.textDelete}>
                Người này hiện không có mặt!!!
              </Text>
            </View>
          ) : (
            <View style={styles.chatInputWrapper}>
              <BzInputTextMultiple
                inputRef={inputRef}
                onFocus={focusChatInputHandle}
                value={message}
                onChangeText={setMessage}
                placeholder="Aa"
                containerStyle={styles.chatInputContainer}
                style={styles.chatInput}
              />
              {message.trim() && (
                <TouchableWithoutFeedback onPress={sendMessageHandle}>
                  <Image
                    source={IMAGE.ICON_SEND}
                    style={{width: 25, height: 25}}
                  />
                </TouchableWithoutFeedback>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  doNotShow: {
    display: 'none',
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollStyle: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  chatInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 30,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#00000029',
  },
  textDelete: {
    fontSize: 20,
    width: '100%',
    textAlign: 'center',
    paddingVertical: 10,
    opacity: 0.8,
  },
  chatInputContainer: {
    paddingTop: 0,
    marginRight: 10,
    flex: 1,
  },
  chatInput: {
    fontSize: 18,
    textAlignVertical: 'center',
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 23,
    height: 'auto',
    maxHeight: 110,
  },
});

export default ChatScreen;
