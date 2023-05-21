import React, {useEffect} from 'react';
import {
  Alert,
  Image,
  ImageURISource,
  Linking,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useDispatch, useSelector} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {API, APP, IMAGE} from '../../constants';
import {removeToken} from '../../redux/user/tokenSlice';
import {removeUser} from '../../redux/user/userSlice';
import {useBzFetch} from '../../hooks/useBzFetch';
import BzCustomHeader from '../../components/BzCustomHeader';
import {StackParamList} from '../../navigations/AppNavigation';
import {RootState} from '../../redux/store';

interface SettingItemProps {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  iconLeft: ImageURISource;
  iconRight?: ImageURISource;
  hideIconRight?: boolean;
  onPress?: () => void;
}

const SettingItem = ({
  title,
  titleStyle,
  iconLeft,
  iconRight,
  hideIconRight,
  onPress,
}: SettingItemProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.itemContentWrap}>
        <View style={styles.itemMainWrap}>
          <Image style={styles.itemIconLeft} source={iconLeft} />
          <Text style={[styles.itemText, titleStyle]}>{title}</Text>
        </View>
        {!hideIconRight && (
          <Image
            style={styles.itemIconRight}
            source={iconRight ?? IMAGE.ICON_CHEVRON_RIGHT}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const SettingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const BzFetch = useBzFetch();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const copyToClipboard = (content: string) => {
    Clipboard.setString(content);
  };

  const gotoProfileUpdateScreenHandle = () => {
    navigation.navigate('UPDATE_INFO');
  };

  const openPolicyPageHandle = async () => {
    const supported = await Linking.canOpenURL(APP.POLICY_URL);
    if (supported) {
      await Linking.openURL(APP.POLICY_URL);
    }
  };

  const signOutConfirm = () => {
    Alert.alert('Xác nhận', 'Đăng xuất khỏi tài khoản hiện tại.', [
      {text: 'Có!', onPress: signOutHandle},
      {
        text: 'Không',
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  };

  const signOutHandle = async () => {
    dispatch(removeToken());
    dispatch(removeUser());
    await GoogleSignin.signOut();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'LOGIN'}],
      }),
    );
  };

  const openAccountDeleteConfirm = () => {
    Alert.alert(
      'Xác nhận',
      'Tài khoản sẽ bị xóa và mất hết thông tin.\nBạn có muốn xóa tài khoản thật không?',
      [
        {text: 'Có!', onPress: accountDeleteHandle},
        {
          text: 'Không',
          onPress: () => {},
          style: 'cancel',
        },
      ],
    );
  };

  const accountDeleteHandle = () => {
    BzFetch.delete(API.USER_DELETE)
      .then(() => {
        signOutHandle()
          .then(() => {})
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '6530740495-rrkogjbq61k5rbqt8jttjhni5uu6juf7.apps.googleusercontent.com',
    });
  }, []);

  return (
    <>
      <BzCustomHeader title="Cài đặt" showRightButton />
      <View style={styles.wrapper}>
        <View style={styles.settingWrap}>
          <SettingItem
            title={`Mã giới thiệu: ${user.attr.invite_code}`}
            iconLeft={IMAGE.ICON_COPY}
            hideIconRight
            onPress={() => copyToClipboard(user.attr.invite_code)}
          />
          <SettingItem
            title="Chỉnh sửa profile"
            iconLeft={IMAGE.ICON_USER_MUL}
            onPress={gotoProfileUpdateScreenHandle}
          />
          <SettingItem
            title="Bảo mật thông tin"
            iconLeft={IMAGE.ICON_SHIELD_LOCK}
            onPress={openPolicyPageHandle}
          />
          <SettingItem
            title="Đăng xuất"
            iconLeft={IMAGE.ICON_DOOR_EXIT}
            onPress={signOutConfirm}
          />
          <SettingItem
            title="Xoá tài khoản"
            titleStyle={{color: '#D63A3A'}}
            iconLeft={IMAGE.ICON_USER_DEL}
            onPress={openAccountDeleteConfirm}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 15,
    backgroundColor: '#F4F4F4',
  },
  settingWrap: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.22,
    elevation: 3,
  },
  itemContentWrap: {
    paddingVertical: 15,
    paddingLeft: 25,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  itemMainWrap: {
    flexDirection: 'row',
  },
  itemIconLeft: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  itemText: {
    fontSize: 18,
    color: '#3E3E3E',
  },
  itemIconRight: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
  },
  showMessage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    marginRight: 15,
    borderRadius: 35,
  },
  flashTitle: {
    fontSize: 18,
  },
  flashText: {
    width: '80%',
    fontSize: 15,
  },
});

export default SettingScreen;
