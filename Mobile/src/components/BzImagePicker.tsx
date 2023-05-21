import React, {useState} from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  ImageURISource,
  PermissionsAndroid,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {onOpen, onClose, BzBottomSheetPicker} from './BzBottomSheetPicker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {IMAGE} from '../constants';

interface ImageResponse {
  uri: string | undefined;
  type: string | undefined;
  name: string | undefined;
  size: {
    width: number | undefined;
    height: number | undefined;
  };
}

interface BzImagePickerProps {
  id: string;
  image?: ImageURISource;
  placeHolderImage?: ImageSourcePropType;
  previewWrapperStyle?: StyleProp<ViewStyle>;
  imagePreviewStyle?: StyleProp<ImageStyle>;
  openButtonStyle?: StyleProp<ViewStyle>;
  onChangeImage: (data: ImageResponse) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const isAndroid = Platform.OS === 'android';
const hasAndroidPermission = async () => {
  if (isAndroid) {
    const permission = PermissionsAndroid.PERMISSIONS.CAMERA;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }
};

const BzImagePicker = ({
  id,
  image,
  placeHolderImage,
  imagePreviewStyle,
  previewWrapperStyle,
  openButtonStyle,
  onChangeImage,
  containerStyle,
}: BzImagePickerProps) => {
  const [imageResponse, setImageResponse] = useState<any>(image);

  const openCamera = () => {
    hasAndroidPermission()
      .then(() => {
        launchCamera({mediaType: 'photo'})
          .then(rs => {
            if (rs.assets?.length) {
              const data: ImageResponse = {
                uri: rs.assets[0].uri,
                type: rs.assets[0].type,
                name: rs.assets[0].fileName,
                size: {
                  width: rs.assets[0].width,
                  height: rs.assets[0].height,
                },
              };

              setImageResponse(data);
              onChangeImage(data);
              onClose(id);
            }
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  const openImageLibrary = () => {
    launchImageLibrary({
      mediaType: 'photo',
    })
      .then(rs => {
        if (rs.assets?.length) {
          const data: ImageResponse = {
            uri: rs.assets[0].uri,
            type: rs.assets[0].type,
            name: rs.assets[0].fileName,
            size: {
              width: rs.assets[0].width,
              height: rs.assets[0].height,
            },
          };

          setImageResponse(data);
          onChangeImage(data);
          onClose(id);
        }
      })
      .catch(err => console.log(err));
  };

  const ImageView = () => {
    if (placeHolderImage && (!imageResponse || !imageResponse.uri)) {
      return (
        <Image
          source={placeHolderImage}
          style={[styles.imagePreview, imagePreviewStyle]}
        />
      );
    } else {
      return (
        <Image
          source={imageResponse}
          style={[styles.imagePreview, imagePreviewStyle]}
        />
      );
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.imagePreviewWrapper, previewWrapperStyle]}>
        <ImageView />

        <View style={[styles.openButtonActions, openButtonStyle]}>
          <TouchableWithoutFeedback
            onPress={() => {
              onOpen(id);
            }}>
            <Image
              source={IMAGE.ICON_CAMERA_PLUS}
              style={{width: 35, height: 35}}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>

      <BzBottomSheetPicker
        height={110}
        id={id}
        data={[
          {
            name: 'Open Camera',
            image: IMAGE.ICON_CAMERA,
            onPress: openCamera,
          },
          {
            name: 'Choose Image',
            image: IMAGE.ICON_PHOTO,
            onPress: openImageLibrary,
          },
        ]}
        searchable={false}
        setSelected={() => {}}
        renderListItem={item => {
          return (
            <TouchableWithoutFeedback
              style={styles.actionButtonWrapper}
              onPress={item.onPress}>
              <View style={styles.actionButton}>
                <Image source={item.image} style={styles.actionIcon} />
                <Text style={styles.actionText}>{item.name}</Text>
              </View>
            </TouchableWithoutFeedback>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewWrapper: {
    maxWidth: '100%',
  },
  imagePreview: {
    overflow: 'hidden',
    width: '100%',
    height: 'auto',
    aspectRatio: 2,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#707070',
  },
  openButtonActions: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  actionButtonWrapper: {},
  actionButton: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#CDD4D9',
  },
  actionIcon: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  actionText: {
    fontSize: 16,
  },
});

export default React.memo(BzImagePicker);
