import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {IMAGE} from '../../constants';
import BzButton from '../../components/BzButton';
import {StackParamList} from '../../navigations/AppNavigation';

const AboutScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  return (
    <View style={styles.wrapper}>
      <Image source={IMAGE.LOGO} style={styles.logo} />
      <Text style={styles.about}>
        Tạo mối quan hệ với các CEO{'\n'}Hỗ trợ kinh doanh, hướng dẫn phát triển
        đội nhóm, tổ chức, thị trường Việt Nam
      </Text>
      <BzButton
        title="Bắt đầu ngay"
        onPress={() => {
          navigation.push('INTRO');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 235,
    height: 80,
    marginBottom: 75,
  },
  about: {
    maxWidth: 334,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 75,
  },
});

export default AboutScreen;
