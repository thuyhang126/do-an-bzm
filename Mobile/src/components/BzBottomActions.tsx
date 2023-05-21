import React from 'react';
import {View, Image, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {IMAGE} from '../constants';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../navigations/AppNavigation';

const BzBottomActions = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const onMatchingPress = () => {
    navigation.navigate('CARD_SWIPER');
  };

  const onChatPress = () => {
    navigation.navigate('CHAT_LIST');
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrap}>
        <TouchableWithoutFeedback onPress={onMatchingPress}>
          <View style={styles.buttonIconWrap}>
            <Image source={IMAGE.ICON_USER_PLUS} style={styles.buttonIcon} />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.buttonWrap}>
        <TouchableWithoutFeedback onPress={onChatPress}>
          <View style={styles.buttonIconWrap}>
            <Image source={IMAGE.ICON_MESSAGE} style={styles.buttonIcon} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#0000001A',
    backgroundColor: '#FFFFFF',
    flex: 0,
  },
  buttonWrap: {
    width: '50%',
  },
  buttonIconWrap: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonIcon: {
    width: 30,
    height: 30,
  },
});

export default React.memo(BzBottomActions);
