import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IMAGE} from '../constants';

const BzLoading = () => {
  const AnimationLoading = () => {
    return (
      <>
        <Image source={IMAGE.ICON_LOADING} style={styles.animationLoading} />
        <Text style={styles.animationText}>Loading...</Text>
      </>
    );
  };
  return (
    <View style={styles.wrapper}>
      <SafeAreaView>
        <View style={styles.animationWrapper}>
          <AnimationLoading />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  animationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationLoading: {
    width: 95,
    height: 95,
    marginBottom: 10,
  },
  animationText: {
    color: '#C4C4C4',
    fontSize: 25,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 2,
  },
});

export default React.memo(BzLoading);
