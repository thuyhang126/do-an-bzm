import React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

interface BzCheckboxProps {
  label?: string;
  value: boolean;
  onValueChange: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const BzCheckbox = ({
  label,
  value,
  onValueChange,
  containerStyle,
}: BzCheckboxProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <CheckBox
        value={value}
        onValueChange={onValueChange}
        style={styles.checkbox}
        tintColors={{true: '#87D1D1', false: '#C4C4C4'}}
        tintColor="#C4C4C4"
        onCheckColor="#87D1D1"
        boxType="square"
      />
      <TouchableWithoutFeedback onPress={onValueChange}>
        <Text style={styles.label}>{label}</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 3,
    marginRight: Platform.OS === 'ios' ? 25 : 30,
    transform: [
      {scaleX: Platform.OS === 'ios' ? 0.75 : 1},
      {scaleY: Platform.OS === 'ios' ? 0.75 : 1},
    ],
  },
  label: {
    fontSize: 14,
    lineHeight: 16,
    color: '#707070',
  },
});

export default React.memo(BzCheckbox);
