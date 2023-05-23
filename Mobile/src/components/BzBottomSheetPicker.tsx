import React, { useRef, createRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Text,
  Dimensions,
  SafeAreaView,
  FlatListProps,
  TextInputProps,
} from 'react-native';
import ActionSheet, {
  SheetManager,
  ActionSheetProps,
  ActionSheetRef,
} from 'react-native-actions-sheet';
import { FlatList } from 'react-native-gesture-handler';

type RenderItemProp<T> = {
  renderListItem: (item: T, index: number) => React.ReactElement;
};

export type PickerProps<T> = {
  id: string;
  data: T[];
  placeholderText?: string;
  searchable?: boolean;
  onSearch?: (value: string) => void;
  label?: string;
  placeholderTextColor?: string;
  closeText?: string;
  setSelected: (value: T) => void;
  loading?: boolean;
  height?: number;
  inputValue?: string;
  noDataFoundText?: string;
  searchInputProps?: TextInputProps;
  flatListProps?: FlatListProps<T>;
  actionsSheetProps?: ActionSheetProps;
} & (T extends { name: string } ? Partial<RenderItemProp<T>> : RenderItemProp<T>);

export const onOpen = (id: any) => {
  SheetManager.show(id);
};

export const onClose = (id: any) => {
  SheetManager.hide(id);
};

export const BzBottomSheetPicker = <T,>({
  id,
  data = [],
  inputValue,
  searchable = false,
  loading = false,
  label,
  height = Math.floor(Dimensions.get('window').height * 0.5),
  closeText = 'Close',
  placeholderText = 'Search',
  noDataFoundText = 'No Data Found.',
  placeholderTextColor = '#8B93A5',
  setSelected,
  onSearch,
  searchInputProps,
  flatListProps,
  actionsSheetProps,
  renderListItem,
}: PickerProps<T>) => {
  const [selectedKey, setSelectedKey] = useState(null);

  const actionSheetRef = createRef<ActionSheetRef>();

  const scrollViewRef = useRef(null);

  const onClose = () => {
    SheetManager.hide(id);
  };

  const Item = ({ item, index }: any) => (
    <TouchableOpacity
      style={{
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: '#CDD4D9',
      }}
      onPress={() => {
        itemOnPress(item);
        setSelectedKey(index);
      }}>
      <Text style={{ fontWeight: selectedKey !== index ? 'normal' : 'bold' }}>
        {item.name ? item.name : null}
      </Text>
    </TouchableOpacity>
  );

  const itemOnPress = (item: T) => {
    setSelected(item);
    onClose();
  };

  const keyExtractor = (_item: T, index: number) => index.toString();

  return (
    <ActionSheet
      id={id}
      ref={actionSheetRef}
      gestureEnabled={true}
      {...actionsSheetProps}>
      <SafeAreaView
        style={{
          height: height,
        }}>
        <FlatList<T>
          disableScrollViewPanResponder={true}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={
            <View
              style={{
                backgroundColor: '#ffffff',
              }}>
              {searchable ? (
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <View style={{ flexBasis: '75%' }}>
                    <TextInput
                      style={{
                        height: 40,
                        borderWidth: 1,
                        borderColor: '#CDD4D9',
                        borderRadius: 6,
                        padding: 10,
                        color: '#333',
                      }}
                      value={inputValue}
                      placeholderTextColor={placeholderTextColor}
                      onChangeText={onSearch}
                      placeholder={placeholderText}
                      clearButtonMode="always"
                      autoCapitalize="none"
                      autoCorrect={false}
                      {...searchInputProps}
                    />
                  </View>

                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                      onClose();
                    }}>
                    <Text>{closeText}</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {label ? (
                <View style={{ marginTop: 10, paddingBottom: 5 }}>
                  <Text
                    style={{
                      color: '#333',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    {label}
                  </Text>
                </View>
              ) : null}

              {loading ? (
                <ActivityIndicator
                  style={{ marginVertical: 20 }}
                  color="#999999"
                />
              ) : null}
            </View>
          }
          ListEmptyComponent={() => {
            if (!loading) {
              return (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingTop: 20,
                  }}>
                  <Text>{noDataFoundText}</Text>
                </View>
              );
            }
            return null;
          }}
          ref={scrollViewRef}
          nestedScrollEnabled={true}
          data={data}
          renderItem={({ item, index }) => {
            if (renderListItem) {
              return renderListItem(item, index);
            }

            return <Item item={item} index={index} />;
          }}
          keyExtractor={keyExtractor}
          {...flatListProps}
        />
      </SafeAreaView>
    </ActionSheet>
  );
};
