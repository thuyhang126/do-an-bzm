import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import BzPressable from './BzPressable';

interface BzButtonProps {
  style?: StyleProp<ViewStyle>;
  iconImageSource?: ImageSourcePropType;
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  contentWrapperStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
  disabled?: boolean;
}

const BzButton = ({
  style,
  iconImageSource,
  title,
  titleStyle,
  contentWrapperStyle,
  onPress,
  disabled,
}: BzButtonProps) => {
  return (
    <BzPressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, style]}>
      <View style={[styles.buttonContentWrapper, contentWrapperStyle]}>
        {iconImageSource && (
          <Image source={iconImageSource} style={styles.buttonIcon} />
        )}
        <Text style={[styles.buttonText, titleStyle]}>{title}</Text>
      </View>
    </BzPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 246,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#87D1D1',
    borderRadius: 33,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.22,
    elevation: 3,
  },
  buttonContentWrapper: {},
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default React.memo(BzButton);
