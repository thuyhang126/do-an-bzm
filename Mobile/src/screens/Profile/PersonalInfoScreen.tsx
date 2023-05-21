import React, {useState} from 'react';
import {
  ImageURISource,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';

import {API, IMAGE, PURPOSE} from '../../constants';
import BzInputTextSingle from '../../components/BzInputTextSingle';
import BzFormGroup from '../../components/BzFormGroup';
import BzCheckbox from '../../components/BzCheckbox';
import BzButton from '../../components/BzButton';
import BzImagePicker from '../../components/BzImagePicker';
import {useBzFetch} from '../../hooks/useBzFetch';
import BzSwitch from '../../components/BzSwitch';
import {setUser, updateAttr} from '../../redux/user/userSlice';
import BzDatePicker from '../../components/BzDatePicker';
import {
  setIsLoading,
  setPersonalSubmitted,
} from '../../redux/global/globalStateSlice';
import BzCustomHeader from '../../components/BzCustomHeader';
import {StackParamList} from '../../navigations/AppNavigation';
import {RootState} from '../../redux/store';

const PersonalInfoScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const BzFetch = useBzFetch();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const purposeData: any = user.attr.purpose
    ? JSON.parse(user.attr.purpose)
    : PURPOSE;
  const [avatar, setAvatar] = useState<any>();
  const [avatarImage, setAvatarImage] = useState<ImageURISource>({
    uri: user.avatar,
  });
  const [name, setName] = useState(user.name);
  const [birthday, setBirthday] = useState(user.attr.birthday);
  const [isNotPublicBirthday, setIsNotPublicBirthday] = useState(
    !user.attr.public,
  );
  const [purpose, setPurpose] = useState(purposeData);

  const handlePurposeChange = (id: number) => {
    let temp = purpose.map((item: any) => {
      if (id === item.id) {
        return {...item, isChecked: !item.isChecked};
      }

      return item;
    });

    setPurpose(temp);
  };

  const handleBirthdayPublic = () => {
    setIsNotPublicBirthday(() => !isNotPublicBirthday);
  };

  const personalInfoUpdateHandle = async () => {
    try {
      const data: any = new FormData();

      if (avatar)
        data.append('avatar', {
          ...avatar,
          uri:
            Platform.OS === 'android'
              ? avatar.uri
              : avatar.uri.replace('file://', ''),
        });

      if (name && birthday && purpose) {
        data.append('name', name);
        data.append('birthday', moment(birthday).format('YYYY-MM-DD'));
        data.append('purpose', JSON.stringify(purpose));
        data.append('public', !isNotPublicBirthday);

        const rs = await BzFetch.put(API.USER_PROFILE_UPDATE, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return rs.data;
      } else {
        Alert.alert('Thông báo', 'Bạn cần nhập và chọn đầy đủ dữ liệu !', [
          {
            text: 'OK',
            onPress: () => {
              dispatch(setIsLoading({isLoading: false}));
            },
            style: 'cancel',
          },
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <BzCustomHeader title="Nhập profile" />
      <ScrollView contentContainerStyle={styles.container}>
        <BzFormGroup
          title="Ảnh đại diện"
          titleStyle={{width: '100%', textAlign: 'center'}}
          child={() => {
            return (
              <BzImagePicker
                id="avatar"
                image={avatarImage}
                placeHolderImage={IMAGE.AVATAR}
                previewWrapperStyle={styles.previewWrapperStyle}
                imagePreviewStyle={styles.imagePreviewStyle}
                openButtonStyle={styles.openButtonStyle}
                onChangeImage={data => {
                  setAvatar(data);
                }}
              />
            );
          }}
        />

        <BzFormGroup
          title="1. Họ và tên (biệt danh)"
          required={true}
          child={() => {
            return (
              <BzInputTextSingle
                autoCapitalize="words"
                onChangeText={setName}
                value={name}
              />
            );
          }}
        />

        <BzFormGroup
          title="2. Ngày tháng năm sinh"
          child={() => {
            return (
              <View>
                <BzDatePicker
                  format="DD ・ MM ・ YYYY"
                  value={birthday}
                  onValueChange={date => {
                    setBirthday(date);
                  }}
                  modalTitle="Chọn ngày"
                  containerStyle={{marginBottom: 10}}
                />
                <BzSwitch
                  label="Không công khai trên profile"
                  value={isNotPublicBirthday}
                  onValueChange={handleBirthdayPublic}
                  activeText=""
                  inActiveText=""
                />
              </View>
            );
          }}
        />

        <BzFormGroup
          title="3. Mục đích sử dụng"
          required={true}
          child={() => {
            return (
              <View>
                <View style={styles.businessModelWrapper}>
                  {purpose.map((product: any) => {
                    return (
                      <View style={styles.businessModelItem} key={product.id}>
                        <BzCheckbox
                          label={product.label}
                          value={product.isChecked}
                          onValueChange={() => {
                            handlePurposeChange(product.id);
                          }}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          }}
        />

        <View style={{alignItems: 'center'}}>
          <BzButton
            title="Tiếp tục"
            onPress={() => {
              dispatch(setIsLoading({isLoading: true}));
              personalInfoUpdateHandle()
                .then(rs => {
                  const {name, email, avatar, ...other} = rs.data.user;
                  dispatch(setUser({name, email, avatar}));
                  dispatch(updateAttr(other));
                  dispatch(setIsLoading({isLoading: false}));
                  dispatch(setPersonalSubmitted());
                  navigation.push('COMPLETE_INFO');
                })
                .catch(err => console.log(err));
            }}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
    paddingVertical: 30,
    width: '100%',
    minHeight: '100%',
  },
  previewWrapperStyle: {
    paddingTop: 10,
    maxWidth: 150,
    alignSelf: 'center',
  },
  imagePreviewStyle: {
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 150,
  },
  openButtonStyle: {
    right: 7,
    bottom: 7,
  },
  birthdayWrapper: {
    marginBottom: 15,
  },
  businessModelWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  businessModelItem: {
    minWidth: '50%',
  },
});

export default PersonalInfoScreen;
