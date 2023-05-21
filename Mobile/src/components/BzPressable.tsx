import React, {useCallback, useState} from 'react';
import {Animated, Pressable, StyleProp, ViewStyle} from 'react-native';

interface BzPressableProps {
  onPress: () => void;
  disabled?: boolean;
  children: any;
  style: StyleProp<ViewStyle>;
}

const BzPressable = ({
  onPress,
  disabled,
  children,
  style,
}: BzPressableProps) => {
  const [scale] = useState(new Animated.Value(1));

  const onPressIn = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 0,
        useNativeDriver: true,
        overshootClamping: true,
      }),
    ]).start();
  }, [scale]);

  return (
    <Animated.View
      style={[
        {
          transform: [
            {
              scale: scale,
            },
          ],
        },
      ]}>
      <Pressable
        style={style}
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}>
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default BzPressable;
