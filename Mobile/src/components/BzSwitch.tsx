import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {Switch} from 'react-native-switch';

interface BzSwitchProps {
  label: string;
  value: boolean;
  onValueChange: () => void;
  activeText?: string;
  inActiveText?: string;
  disabled?: boolean;
}

const BzSwitch = ({
  label,
  value,
  onValueChange,
  activeText,
  inActiveText,
  disabled,
}: BzSwitchProps) => {
  return (
    <TouchableWithoutFeedback onPress={onValueChange} disabled={disabled}>
      <View style={styles.wrapper}>
        <Text style={styles.switchLabel}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          activeText={activeText}
          inActiveText={inActiveText}
          circleSize={20}
          barHeight={20}
          circleBorderWidth={1}
          backgroundActive={'#87D1D1'}
          backgroundInactive={'#E2E2E2'}
          circleActiveColor={'#FFFFFF'}
          circleInActiveColor={'#FFFFFF'}
          circleBorderActiveColor={'#87D1D1'}
          circleBorderInactiveColor={'#E2E2E2'}
          changeValueImmediately={true}
          renderActiveText={true}
          renderInActiveText={true}
          switchLeftPx={2}
          switchRightPx={2}
          switchWidthMultiplier={2}
          switchBorderRadius={30}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 15,
    lineHeight: 16,
    marginRight: 30,
  },
});

export default React.memo(BzSwitch);
