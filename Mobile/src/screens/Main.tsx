import React from 'react';
import {View, StatusBar} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import AppNavigation from '../navigations/AppNavigation';
import BzLoading from '../components/BzLoading';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootState} from '../redux/store';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const Main = () => {
  const navigationRef = useNavigationContainerRef();
  const {isLoading} = useSelector((state: RootState) => state.globalState);

  return (
    <NavigationContainer
      theme={theme}
      ref={navigationRef}
      onReady={() => {}}
      onStateChange={async () => {}}>
      {isLoading && <BzLoading />}
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
          animated={true}
        />
        <SafeAreaView style={{flex: 1}}>
          <AppNavigation />
        </SafeAreaView>
      </View>
    </NavigationContainer>
  );
};

export default Main;
