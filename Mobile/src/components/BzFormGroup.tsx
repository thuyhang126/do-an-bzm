import React, {ReactNode} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface BzFormGroupProps {
  required?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  subTitle?: string;
  child: () => ReactNode;
}

const BzFormGroup = ({
  required,
  containerStyle,
  title,
  titleStyle,
  subTitle,
  child,
}: BzFormGroupProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.titleWrapper}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {required && <Text style={styles.requireBabel}>Bắt buộc</Text>}
      </View>
      {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
      {child()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    color: '#3E3E3E',
  },
  requireBabel: {
    fontSize: 10,
    color: '#FFFFFF',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 30,
    backgroundColor: '#D63A3A',
  },
  subTitle: {
    fontSize: 11,
    color: '#707070',
  },
});

export default React.memo(BzFormGroup);
