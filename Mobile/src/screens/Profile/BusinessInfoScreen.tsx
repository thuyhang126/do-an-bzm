import React, {useState} from 'react';
import {
  Alert,
  ImageURISource,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {API, BUSINESS_MODEL, IMAGE, POSITION} from '../../constants';
import BzInputTextSingle from '../../components/BzInputTextSingle';
import BzFormGroup from '../../components/BzFormGroup';
import BzDropdownInput from '../../components/BzDropdownInput';
import BzInputTextMultiple from '../../components/BzInputTextMultiple';
import BzCheckbox from '../../components/BzCheckbox';
import BzButton from '../../components/BzButton';
import {useBzFetch} from '../../hooks/useBzFetch';
import {setUser, updateAttr} from '../../redux/user/userSlice';
import BzImagePicker from '../../components/BzImagePicker';
import {
  setBusinessSubmitted,
  setIsLoading,
} from '../../redux/global/globalStateSlice';
import BzCustomHeader from '../../components/BzCustomHeader';
import {StackParamList} from '../../navigations/AppNavigation';
import {RootState} from '../../redux/store';

const BusinessInfoScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const BzFetch = useBzFetch();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const businessModelData = user.attr.business_model
    ? JSON.parse(user.attr.business_model)
    : BUSINESS_MODEL;
  const [businessName, setBusinessName] = useState(user.attr.company);
  const [position, setPosition] = useState<any>(user.attr.position);
  const [cardVisit, setCardVisit] = useState<any>();
  const [cardVisitImage, setCardVisitImage] = useState<ImageURISource>({
    uri: user.attr.card_visit,
  });
  const [businessModel, setBusinessModel] = useState(businessModelData);
  const [description, setDescription] = useState(user.attr.descriptions);

  const handleBusinessModelChange = (id: number) => {
    let temp = businessModel.map((model: any) => {
      if (id === model.id) {
        return {...model, isChecked: !model.isChecked};
      }

      return model;
    });

    setBusinessModel(temp);
  };

  const businessInfoUpdateHandle = async () => {
    try {
      const data: any = new FormData();

      if (cardVisit)
        data.append('card_visit', {
          ...cardVisit,
          uri:
            Platform.OS === 'android'
              ? cardVisit.uri
              : cardVisit.uri.replace('file://', ''),
        });

      if (businessName && position && businessModel && description) {
        data.append('company', businessName);
        data.append('position', position);
        data.append('business_model', JSON.stringify(businessModel));
        data.append('descriptions', description);

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
      <BzCustomHeader title="Nhập thông tin" />
      <ScrollView contentContainerStyle={styles.container}>
        <BzFormGroup
          title="1. Tên tổ chức, công ty"
          subTitle="Tên tổ chức công ty, tên gọi của mô hình kinh doanh bạn đang tham gia"
          child={() => {
            return (
              <BzInputTextSingle
                style={styles.businessName}
                autoCapitalize="words"
                onChangeText={setBusinessName}
                value={businessName}
              />
            );
          }}
        />

        <BzFormGroup
          title="2. Vị trí hiện tại"
          subTitle="Vị trí, chức vụ hiện tại của bạn là gì?"
          child={() => {
            return (
              <BzDropdownInput
                id="position"
                data={POSITION}
                setSelected={selected => {
                  setPosition(selected.value);
                }}
                selected={position}
              />
            );
          }}
        />

        <BzFormGroup
          title="3. Danh thiếp"
          subTitle="Chụp ảnh danh thiếp, trang chủ, tài khoản mạng xã hội, để chứng minh công việc của bạn"
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
          title="4. Lĩnh vực kinh doanh"
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

        <BzFormGroup
          title="5. Thêm mô tả"
          subTitle="Nhập mô tả giới thiệu tự do về công việc kinh doanh của bạn"
          child={() => {
            return (
              <BzInputTextMultiple
                autoCapitalize="words"
                onChangeText={setDescription}
                value={description}
              />
            );
          }}
        />

        <View style={{alignItems: 'center'}}>
          <BzButton
            title="Tiếp tục"
            onPress={() => {
              dispatch(setIsLoading({isLoading: true}));
              businessInfoUpdateHandle()
                .then(rs => {
                  const {name, email, avatar, ...other} = rs.data.user;
                  dispatch(setUser({name, email, avatar}));
                  dispatch(updateAttr(other));
                  dispatch(setIsLoading({isLoading: false}));
                  dispatch(setBusinessSubmitted());
                  navigation.push('PERSONAL_INFO');
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
  businessName: {},
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
  businessModelWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  businessModelItem: {
    minWidth: '50%',
  },
});

export default BusinessInfoScreen;
