import React, {useState} from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {IMAGE} from '../constants';

interface BzDatePickerProps {
  mode?: string;
  format?: string;
  value: any;
  onValueChange: (date: any) => void;
  modalTitle?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const BzDatePicker = ({
  mode = 'date',
  format = 'DD-MM-YYYY',
  value,
  onValueChange,
  modalTitle,
  containerStyle,
}: BzDatePickerProps) => {
  const [date, setDate] = useState(value ? moment(value).toDate() : new Date());
  const [open, setOpen] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableWithoutFeedback onPress={() => setOpen(true)}>
        <View style={styles.button}>
          <Text style={styles.selected}>
            {value && moment(date).format(format)}
          </Text>
          <Image source={IMAGE.ICON_CALENDAR} style={styles.icon} />
        </View>
      </TouchableWithoutFeedback>

      <DatePicker
        modal
        mode={mode as any}
        locale={'vi-VN'}
        title={modalTitle}
        confirmText={'Xác nhận'}
        cancelText={'Hủy bỏ'}
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
          onValueChange(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderColor: '#C4C4C4',
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  selected: {
    fontSize: 18,
    color: '#707070',
  },
  icon: {
    width: 24,
    aspectRatio: 1,
  },
});

export default React.memo(BzDatePicker);
