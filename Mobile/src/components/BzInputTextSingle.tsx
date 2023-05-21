import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

interface BzInputTextSingleProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
}

const BzInputTextSingle = ({
  containerStyle,
  style,
  ...otherProps
}: BzInputTextSingleProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput style={[styles.inputText, style]} {...otherProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: '#C4C4C4',
    borderBottomWidth: 1,
  },
  inputText: {
    width: '100%',
    fontSize: 18,
    color: '#707070',
    padding: 5,
  },
});

export default React.memo(BzInputTextSingle);
