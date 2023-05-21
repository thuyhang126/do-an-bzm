import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

interface BzInputTextMultipleProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputRef?: any;
}

const BzInputTextMultiple = ({
  containerStyle,
  style,
  multiline,
  inputRef,
  ...otherProps
}: BzInputTextMultipleProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.inputText, style]}
        multiline={true}
        ref={inputRef}
        {...otherProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  inputText: {
    width: '100%',
    fontSize: 18,
    color: '#707070',
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 110,
    textAlignVertical: 'top',
    borderColor: '#C4C4C4',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default React.memo(BzInputTextMultiple);
