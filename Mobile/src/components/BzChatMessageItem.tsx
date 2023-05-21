import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import moment from 'moment';

import {IMAGE} from '../constants';

interface BzChatMessageItemProps {
  item: any;
  chatUser: any;
  user: any;
}

const BzChatMessageItem = ({item, chatUser, user}: BzChatMessageItemProps) => {
  const [data, setData] = useState(item);

  const showSeenAtOnPress = () => {
    setData((prev: any) => {
      return {
        ...prev,
        show_seen_at: !prev.show_seen_at,
      };
    });
  };

  if (user.attr.id === data.sender_id) {
    return (
      <View style={[styles.messageItemWrapper, styles.userMessageItemWrapper]}>
        {data.seen_at && data.show_seen_at && (
          <View style={styles.readIconMark}>
            <Text style={styles.readTextMark}>
              Đã đọc{'\n'}
              {moment(data.seen_at).format('HH:mm')}
            </Text>
          </View>
        )}

        {!data.seen_at && !data.sent_at && (
          <Image
            source={IMAGE.ICON_CIRCLE_CHECK_WHITE}
            style={styles.sentIconMark}
          />
        )}

        {!data.seen_at && data.sent_at && (
          <Image source={IMAGE.ICON_CIRCLE_CHECK} style={styles.sentIconMark} />
        )}
        <TouchableOpacity
          activeOpacity={1}
          onPress={showSeenAtOnPress}
          style={[styles.messageItemBox, styles.userMessage]}>
          <Text style={[styles.messageItemText, styles.userMessageText]}>
            {data.message}
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.messageItemWrapper}>
        <Image
          source={{uri: chatUser.avatar}}
          style={styles.messageItemAvatar}
        />
        <View style={styles.messageItemBox}>
          <Text style={styles.messageItemText}>{data.message}</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  messageItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userMessageItemWrapper: {
    justifyContent: 'flex-end',
  },
  userMessage: {
    backgroundColor: '#87D1D1',
  },
  messageItemText: {
    fontSize: 18,
    color: '#3E3E3E',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  messageItemAvatar: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginRight: 7,
  },
  messageItemBox: {
    maxWidth: '80%',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
  },
  sentIconMark: {
    width: 20,
    height: 20,
  },
  readIconMark: {
    marginRight: 5,
    alignSelf: 'flex-end',
  },
  readTextMark: {
    fontSize: 12,
    color: '#C4C4C4',
    textAlign: 'right',
  },
});

export default BzChatMessageItem;
