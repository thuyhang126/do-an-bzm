import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { onOpen, BzBottomSheetPicker } from './BzBottomSheetPicker';
import { IMAGE } from '../constants';

interface BzDropdownInputProps {
  id: string;
  data: any;
  searchable?: boolean;
  onSearch?: (value: string) => void;
  label?: string;
  setSelected: (value: any) => void;
  inputValue?: string;
  selected?: any;
  containerStyle?: StyleProp<ViewStyle>;
  bottomSheetHeight?: number;
  type?: any
}

const BzDropdownInput = ({
  id,
  data,
  searchable,
  onSearch,
  label,
  setSelected,
  selected,
  inputValue,
  containerStyle,
  bottomSheetHeight,
  type,
}: BzDropdownInputProps) => {
  const itemSelected = data.filter((item: any) => {
    return item.value == selected;
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableWithoutFeedback
        onPress={() => {
          onOpen(id);
        }}>
        <View style={styles.selection}>
          <Text style={styles.selected}>{itemSelected[0]?.name}</Text>
          <Image
            source={IMAGE.ICON_CHEVRON_DOWN}
            style={styles.selectionImage}
          />
        </View>
      </TouchableWithoutFeedback>

      <BzBottomSheetPicker
        height={bottomSheetHeight}
        id={id}
        data={data}
        searchable={searchable}
        onSearch={onSearch}
        label={label}
        setSelected={setSelected}
        inputValue={inputValue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  selection: {
    borderWidth: 1,
    borderColor: '#C4C4C4',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    borderColor: '#C4C4C4',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selected: {
    fontSize: 18,
    color: '#707070',
    padding: 5,
    paddingHorizontal: 10,
    flex: 1,
  },
  selectionImage: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
});

export default React.memo(BzDropdownInput);
