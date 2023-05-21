import React, {useState} from 'react';
import {
  ImageURISource,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

import {
  API,
  BUSINESS_MODEL,
  IMAGE,
  POSITION,
  PURPOSE,
  STATE,
} from '../../constants';
import BzBottomActions from '../../components/BzBottomActions';
import BzDatePicker from '../../components/BzDatePicker';
import BzDropdownInput from '../../components/BzDropdownInput';
import BzFormGroup from '../../components/BzFormGroup';
import BzInputTextSingle from '../../components/BzInputTextSingle';
import BzSwitch from '../../components/BzSwitch';
import BzCheckbox from '../../components/BzCheckbox';
import BzInputTextMultiple from '../../components/BzInputTextMultiple';
import BzImagePicker from '../../components/BzImagePicker';
import BzButton from '../../components/BzButton';
import {setIsLoading} from '../../redux/global/globalStateSlice';
import {setUser, updateAttr} from '../../redux/user/userSlice';
import {useBzFetch} from '../../hooks/useBzFetch';
import BzCustomHeader from '../../components/BzCustomHeader';
import {RootState} from '../../redux/store';

const UpdateInfoScreen = () => {
  const BzFetch = useBzFetch();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const businessModelData: any = user.attr.business_model
    ? JSON.parse(user.attr.business_model)
    : BUSINESS_MODEL;
  const [businessName, setBusinessName] = useState(user.attr.company);
  const [position, setPosition] = useState<any>(user.attr.position);
  const [state, setState] = useState<any>(user.attr.state);
  const [cardVisit, setCardVisit] = useState<any>();
  const [cardVisitImage, setCardVisitImage] = useState<ImageURISource>({
    uri: user.attr.card_visit,
  });
  const [businessModel, setBusinessModel] = useState(businessModelData);
  const [description, setDescription] = useState(user.attr.descriptions);
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

  const handleBirthdayPublic = () => {
    setIsNotPublicBirthday(() => !isNotPublicBirthday);
  };

  const handlePurposeChange = (id: number) => {
    let temp = purpose.map((item: any) => {
      if (id === item.id) {
        return {...item, isChecked: !item.isChecked};
      }

      return item;
    });

    setPurpose(temp);
  };

  const handleBusinessModelChange = (id: number) => {
    let temp = businessModel.map((model: any) => {
      if (id === model.id) {
        return {...model, isChecked: !model.isChecked};
      }

      return model;
    });

    setBusinessModel(temp);
  };

  const profileInfoUpdateHandle = async () => {
    try {
      const data = new FormData();

      if (avatar)
        data.append('avatar', {
          ...avatar,
          uri:
            Platform.OS === 'android'
              ? avatar.uri
              : avatar.uri.replace('file://', ''),
        });

      if (name) data.append('name', name);
      if (birthday)
        data.append('birthday', moment(birthday).format('YYYY-MM-DD'));
      if (purpose) data.append('purpose', JSON.stringify(purpose));
      data.append('public', !isNotPublicBirthday);

      if (cardVisit)
        data.append('card_visit', {
          ...cardVisit,
          uri:
            Platform.OS === 'android'
              ? cardVisit.uri
              : cardVisit.uri.replace('file://', ''),
        });

      if (businessName) data.append('company', businessName);
      if (position) data.append('position', position);
      if (businessModel)
        data.append('business_model', JSON.stringify(businessModel));
      if (description) data.append('descriptions', description);
      data.append('state', state);

      const rs = await BzFetch.put(API.USER_PROFILE_UPDATE, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return rs.data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <BzCustomHeader title="Profile" showRightButton />
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}>
          <View style={{position: 'absolute', zIndex: 9, width: '100%'}}>
            <BzImagePicker
              id="avatar"
              image={avatarImage}
              placeHolderImage={IMAGE.AVATAR}
              previewWrapperStyle={styles.avatarPreviewWrapperStyle}
              imagePreviewStyle={styles.avatarImagePreviewStyle}
              openButtonStyle={styles.openButtonStyle}
              onChangeImage={data => {
                setAvatar(data);
              }}
            />
          </View>

          <BzFormGroup
            title="1. Họ và tên (biệt danh)"
            containerStyle={[styles.formGroupContainer, {paddingTop: 80}]}
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
            containerStyle={styles.formGroupContainer}
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
            title="3. Chức vụ"
            containerStyle={styles.formGroupContainer}
            child={() => {
              return (
                <BzDropdownInput
                  id="position"
                  data={POSITION}
                  setSelected={selected => {
                    setPosition(selected.value);
                  }}
                  selected={position}
                  bottomSheetHeight={280}
                />
              );
            }}
          />

          <BzFormGroup
            title="4. Tên tổ chức, công ty"
            containerStyle={styles.formGroupContainer}
            child={() => {
              return (
                <BzInputTextSingle
                  autoCapitalize="words"
                  onChangeText={setBusinessName}
                  value={businessName}
                />
              );
            }}
          />

          <BzFormGroup
            title="5. Mục đích sử dụng"
            containerStyle={styles.formGroupContainer}
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

          <BzFormGroup
            title="6. Mô tả"
            containerStyle={styles.formGroupContainer}
            child={() => {
              return (
                <BzInputTextMultiple
                  style={{fontSize: 15}}
                  autoCapitalize="words"
                  onChangeText={setDescription}
                  value={description}
                />
              );
            }}
          />

          <BzFormGroup
            title="7. Trạng thái"
            containerStyle={styles.formGroupContainer}
            child={() => {
              return (
                <BzDropdownInput
                  id="state"
                  data={STATE}
                  setSelected={selected => {
                    setState(selected.value);
                  }}
                  selected={state}
                  bottomSheetHeight={80}
                />
              );
            }}
          />

          <BzFormGroup
            title="8. Danh thiếp"
            containerStyle={styles.formGroupContainer}
            child={() => {
              return (
                <BzImagePicker
                  id="cardVisit"
                  image={cardVisitImage}
                  placeHolderImage={IMAGE.CARD_VISIT}
                  previewWrapperStyle={styles.previewWrapperStyle}
                  imagePreviewStyle={styles.imagePreviewStyle}
                  openButtonStyle={styles.openButtonStyle}
                  onChangeImage={data => {
                    setCardVisit(data);
                  }}
                />
              );
            }}
          />

          <BzFormGroup
            title="9. Lĩnh vực kinh doanh"
            containerStyle={[styles.formGroupContainer, {marginBottom: 75}]}
            child={() => {
              return (
                <View style={styles.businessModelWrapper}>
                  {businessModel.map((product: any) => {
                    return (
                      <View style={styles.businessModelItem} key={product.id}>
                        <BzCheckbox
                          label={product.label}
                          value={product.isChecked}
                          onValueChange={() => {
                            handleBusinessModelChange(product.id);
                          }}
                        />
                      </View>
                    );
                  })}
                </View>
              );
            }}
          />

          <View style={{alignItems: 'center'}}>
            <BzButton
              title="Lưu lại"
              onPress={() => {
                dispatch(setIsLoading({isLoading: true}));
                profileInfoUpdateHandle()
                  .then(rs => {
                    const {name, email, avatar, ...other} = rs.data.user;
                    dispatch(
                      setUser({
                        name,
                        email,
                        avatar,
                      }),
                    );
                    dispatch(updateAttr(other));
                    dispatch(setIsLoading({isLoading: false}));
                  })
                  .catch(err => {
                    console.log(err);
                    dispatch(setIsLoading({isLoading: false}));
                  });
              }}
            />
          </View>
        </ScrollView>

        <BzBottomActions />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
  },
  scrollView: {
    width: '100%',
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingVertical: 50,
    paddingTop: 80,
  },
  formGroupContainer: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0000001A',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.22,
    elevation: 3,
  },
  avatarPreviewWrapperStyle: {
    paddingTop: 10,
    maxWidth: 120,
    alignSelf: 'center',
  },
  avatarImagePreviewStyle: {
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 150,
  },
  businessModelWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  businessModelItem: {
    minWidth: '50%',
  },
  previewWrapperStyle: {
    maxWidth: 360,
    maxHeight: 220,
  },
  imagePreviewStyle: {
    aspectRatio: 92 / 56,
    borderRadius: 20,
  },
  openButtonStyle: {
    right: 5,
    bottom: 5,
  },
});

export default UpdateInfoScreen;
