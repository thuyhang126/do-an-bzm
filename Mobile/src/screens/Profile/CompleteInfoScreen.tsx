import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {API, IMAGE} from '../../constants';
import {useBzFetch} from '../../hooks/useBzFetch';
import {updateAttr} from '../../redux/user/userSlice';
import BzButton from '../../components/BzButton';
import BzFormGroup from '../../components/BzFormGroup';
import BzInputTextSingle from '../../components/BzInputTextSingle';
import {setIsLoading} from '../../redux/global/globalStateSlice';
import BzCustomHeader from '../../components/BzCustomHeader';
import {StackParamList} from '../../navigations/AppNavigation';
import {RootState} from '../../redux/store';

const CompleteInfoScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const BzFetch = useBzFetch();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [registerCode, setRegisterCode] = useState(user.attr.register_code);

  const completeInfoUpdateHandle = async () => {
    try {
      const rs = await BzFetch.post(API.USER_REF_CODE, {
        invite_code: registerCode,
      });

      return rs.data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user.attr.status) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'CARD_SWIPER'}],
        }),
      );
    }
  }, []);

  return (
    <>
      <BzCustomHeader />
      <View style={styles.wrapper}>
        <Image source={IMAGE.LOGO} style={styles.logo} />
        <Text style={styles.about}>
          Cảm ơn bạn đã chia sẻ thông tin.{'\n'}Hệ thống sẽ kiểm duyệt thông
          tin, vui lòng quay lại ứng dụng trong 24 giờ hoặc nhập mã giới thiệu
          để sử dụng ngay.
        </Text>
        <Image source={IMAGE.ICON_CLOCK} style={styles.clockIcon} />
        <BzFormGroup
          containerStyle={styles.codeWrapper}
          titleStyle={styles.codeTitle}
          title="Nhập mã giới thiệu :"
          child={() => {
            return (
              <View style={{paddingHorizontal: 10}}>
                <BzInputTextSingle
                  placeholder="XXXX0000"
                  value={registerCode}
                  onChangeText={setRegisterCode}
                  style={{textAlign: 'center', textTransform: 'uppercase'}}
                />
              </View>
            );
          }}
        />
        <BzButton
          title="Tiếp tục"
          onPress={() => {
            dispatch(setIsLoading({isLoading: true}));
            completeInfoUpdateHandle()
              .then(rs => {
                const {...other} = rs.data.user;
                dispatch(updateAttr(other));
                dispatch(setIsLoading({isLoading: false}));

                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'CARD_SWIPER'}],
                  }),
                );
              })
              .catch(err => {
                dispatch(setIsLoading({isLoading: false}));
                console.log(err);
              });
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  logo: {
    width: 235,
    height: 80,
    marginBottom: 50,
  },
  about: {
    maxWidth: 334,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  clockIcon: {
    width: 30,
    height: 30,
    marginBottom: 30,
  },
  codeWrapper: {
    marginBottom: 50,
  },
  codeTitle: {
    fontSize: 18,
    color: '#87D1D1',
    fontWeight: '700',
  },
});

export default CompleteInfoScreen;
