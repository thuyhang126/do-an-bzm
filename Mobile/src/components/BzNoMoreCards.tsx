import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {IMAGE} from '../constants';
import BzButton from './BzButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../navigations/AppNavigation';

interface NoMoreCardsProps {
  isSwipedAll: boolean;
}

const BzNoMoreCards = ({isSwipedAll}: NoMoreCardsProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const additionStyles = StyleSheet.create({
    container: {
      zIndex: isSwipedAll ? 9 : 1,
    },
  });

  return (
    <View style={[styles.container, additionStyles.container]}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={IMAGE.ICON_MOON_STAR}
          style={{width: 118, height: 118, marginBottom: 15}}
        />

        <Text style={styles.description}>
          Danh sách giới thiệu trong ngày hôm nay{'\n'}đã kết thúc.
          {'\n'}Vui lòng quay lại trong 12 giờ tới.
        </Text>

        <BzButton
          title="Chỉnh sửa thông tin cá nhân"
          style={styles.buttonStyle}
          titleStyle={styles.buttonTitleStyle}
          onPress={() => {
            navigation.push('UPDATE_INFO');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    zIndex: 1,
  },
  description: {
    fontSize: 18,
    color: '#C4C4C4',
    textAlign: 'center',
    marginBottom: 100,
  },
  buttonStyle: {
    width: Math.floor(Dimensions.get('window').width * 0.85),
    backgroundColor: '#87D1D1',
    height: 60,
  },
  buttonTitleStyle: {
    fontSize: 16,
    textTransform: 'none',
  },
});

export default React.memo(BzNoMoreCards);
