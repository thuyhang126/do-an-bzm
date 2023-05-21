import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  Image,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';

import {API, IMAGE} from '../../constants';
import {SocketContext} from '../../contexts';
import {useBzFetch} from '../../hooks/useBzFetch';
import BzBottomActions from '../../components/BzBottomActions';
import BzCustomHeader from '../../components/BzCustomHeader';
import {StackParamList} from '../../navigations/AppNavigation';
import {RootState} from '../../redux/store';

const ChatListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const socket = useContext(SocketContext);
  const BzFetch = useBzFetch();
  const user = useSelector((state: RootState) => state.user);

  const [friends, setFriends] = useState<any>([]);
  const [searchName, setSearchName] = useState('');
  const [needRefreshChatList, setNeedRefreshChatList] = useState(false);

  const currentPage = useRef(1);

  const chatItemHandle = (user: any) => {
    navigation.push('CHAT', {chatUser: user});
  };

  const renderItem = ({item}: {item: {user: any; messageLast: any}}) => {
    const {user: userInfo, messageLast: lastMessage} = item;
    const senderName = user.attr.id === lastMessage.sender_id ? 'Tôi: ' : '';
    const lastSentAt = moment(lastMessage.sent_at).format('DD/MM/YYYY');
    const stateColor =
      userInfo.state === 'online' && !userInfo.deleted_at
        ? '#C0E087'
        : '#BE4A4A';

    return (
      <View style={styles.chatItemWrap} key={userInfo.id}>
        <TouchableOpacity
          onPress={() => {
            chatItemHandle(userInfo);
          }}>
          <>
            <View style={styles.chatItemStateWrap}>
              <Image
                source={{uri: userInfo.avatar}}
                style={styles.chatItemAvatar}
              />
              <View
                style={[styles.chatItemState, {backgroundColor: stateColor}]}>
                {(userInfo.state === 'offline' || !userInfo.deleted_at) && (
                  <Text style={styles.chatItemOfflineText}>-</Text>
                )}
              </View>
            </View>
            <View style={styles.chatItemSummary}>
              <View>
                <Text style={styles.chatItemName}>{userInfo.name}</Text>
                <Text style={styles.chatItemBusiness}>
                  {userInfo.position} - {userInfo.company}
                </Text>
              </View>

              {lastMessage.message && (
                <Text
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  style={
                    lastMessage.seen_at
                      ? styles.chatItemLastMessage
                      : [styles.chatItemLastMessage, styles.chatMessageUnRead]
                  }>
                  {senderName}
                  {lastMessage.message} - {lastSentAt}
                </Text>
              )}

              {!lastMessage.message && (
                <Text
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  style={
                    lastMessage.seen_at
                      ? styles.chatItemLastMessage
                      : [styles.chatItemLastMessage, styles.chatMessageUnRead]
                  }>
                  Xin chào! - {lastSentAt}
                </Text>
              )}
            </View>
          </>
        </TouchableOpacity>
      </View>
    );
  };

  const handleLoadMore = () => {
    let friendListAPI = API.FRIEND_LIST;
    currentPage.current++;

    if (searchName) {
      friendListAPI += `?offset=${currentPage.current}` + '&name=' + searchName;
    } else {
      friendListAPI += `?offset=${currentPage.current}`;
    }

    BzFetch.get(friendListAPI)
      .then(({data: rs}) => {
        if (rs.data.listMatches.length) {
          setFriends([...friends, ...rs.data.listMatches]);
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    let friendListAPI = API.FRIEND_LIST;
    if (searchName) {
      friendListAPI += '?name=' + searchName;
    }
    currentPage.current = 1;

    BzFetch.get(friendListAPI)
      .then(({data: rs}) => {
        setFriends(rs.data.listMatches);
      })
      .catch(err => console.log(err));
  }, [searchName, needRefreshChatList]);

  useEffect(() => {
    socket?.on('refresh-chat-list', () => {
      setNeedRefreshChatList(prev => !prev);
    });

    return () => {
      socket?.off('refresh-chat-list');
    };
  }, [socket]);

  return (
    <>
      <BzCustomHeader user={user} title="Chats" showRightButton={true} />
      <View style={styles.wrapper}>
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm thông tin"
            onChangeText={setSearchName}
          />
          <Image source={IMAGE.ICON_SEARCH} style={styles.searchIcon} />
        </View>
        <FlatList
          data={friends}
          renderItem={renderItem}
          initialNumToRender={2}
          onEndReachedThreshold={friends.length > 11 ? 0.25 : -1}
          onEndReached={handleLoadMore}
          style={styles.scrollStyle}
          contentContainerStyle={{
            paddingHorizontal: 25,
            paddingVertical: 15,
          }}></FlatList>
        <BzBottomActions />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollStyle: {
    width: '100%',
  },
  searchWrap: {
    marginHorizontal: 25,
    marginVertical: 15,
    marginBottom: 20,
  },
  searchIcon: {
    width: 25,
    height: 25,
    position: 'absolute',
    left: 15,
    top: 7.5,
  },
  searchInput: {
    width: '100%',
    height: 40,
    fontSize: 18,
    textAlignVertical: 'center',
    paddingLeft: 50,
    paddingVertical: 0,
    backgroundColor: '#F5F5F5',
    borderRadius: 28,
  },
  chatItemWrap: {
    marginBottom: 15,
  },
  chatItemStateWrap: {
    position: 'absolute',
    width: 70,
    height: 70,
  },
  chatItemState: {
    width: 10,
    height: 10,
    borderRadius: 10,
    position: 'absolute',
    bottom: -1,
    right: 15,
  },
  chatItemOfflineText: {
    fontSize: 12,
    lineHeight: 12,
    textAlign: 'center',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatItemAvatar: {
    width: 70,
    height: 70,
    borderRadius: 70,
  },
  chatItemSummary: {
    paddingLeft: 85,
    height: 70,
    justifyContent: 'space-between',
  },
  chatItemName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  chatItemBusiness: {
    fontSize: 15,
    color: '#707070',
  },
  chatItemLastMessage: {
    fontSize: 15,
    color: '#B9B9B9',
  },
  chatMessageUnRead: {
    fontWeight: '700',
    color: '#000000',
  },
});

export default ChatListScreen;
