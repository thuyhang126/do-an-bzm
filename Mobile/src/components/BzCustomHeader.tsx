import React from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import {IMAGE} from '../constants';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../navigations/AppNavigation';

interface BzCustomHeaderProps {
  leftWrapperStyle?: StyleProp<ViewStyle>;
  titleWrapperStyle?: StyleProp<ViewStyle>;
  rightWrapperStyle?: StyleProp<ViewStyle>;
  user?: any;
  showUserName?: boolean;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  showRightButton?: boolean;
  rightImageSource?: ImageURISource;
  rightImageStyle?: StyleProp<ImageStyle>;
  rightButtonOnPress?: () => void;
  showBottomBorder?: boolean;
}

const BzCustomHeader = ({
  leftWrapperStyle,
  titleWrapperStyle,
  rightWrapperStyle,
  user,
  showUserName,
  title,
  titleStyle,
  showRightButton,
  rightImageSource,
  rightImageStyle,
  rightButtonOnPress,
  showBottomBorder,
}: BzCustomHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const route = useRoute();
  const canGoBack = navigation.canGoBack() && route.name !== 'CARD_SWIPER';
  const goBackHandle = () => {
    if (canGoBack) {
      navigation.goBack();
    }
  };

  const goToSettingScreenHandle = () => {
    navigation.navigate('SETTING');
  };

  return (
    <View
      style={[
        styles.wrapper,
        leftWrapperStyle,
        {borderBottomWidth: showBottomBorder ? 1 : 0},
      ]}>
      <View style={styles.leftWrapper}>
        {canGoBack && (
          <View style={styles.goBack}>
            <TouchableWithoutFeedback onPress={goBackHandle}>
              <Image
                style={[styles.backButtonImage]}
                source={IMAGE.ICON_CHEVRON_LEFT}
              />
            </TouchableWithoutFeedback>
          </View>
        )}

        {user && (
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.push('CARD_PROFILE', {user});
            }}>
            <View style={styles.userCardWrapper}>
              {user.avatar && (
                <Image style={styles.avatar} source={{uri: user.avatar}} />
              )}
              {showUserName && (
                <Text style={styles.userName} numberOfLines={1}>
                  {user.name}
                </Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>

      {title && (
        <View style={[styles.titleWrapper, titleWrapperStyle]}>
          <Text style={[styles.titleStyle, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}

      <View style={[styles.rightWrapper, rightWrapperStyle]}>
        {showRightButton && (
          <TouchableWithoutFeedback
            onPress={rightButtonOnPress ?? goToSettingScreenHandle}>
            <Image
              style={[styles.rightImageStyle, rightImageStyle]}
              source={rightImageSource ?? IMAGE.ICON_SETTINGS}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#0000001A',
    backgroundColor: '#FFFFFF',
  },
  leftWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  goBack: {
    marginRight: 20,
  },
  backButtonImage: {
    width: 35,
    height: 35,
  },
  userCardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 35,
    height: 35,
    marginRight: 15,
    borderRadius: 35,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  titleWrapper: {
    flex: 2,
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
    color: '#000000',
  },
  rightWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rightImageStyle: {
    width: 30,
    height: 30,
  },
});

export default React.memo(BzCustomHeader);
