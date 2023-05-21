import React, {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';

import AboutScreen from '../screens/Intro/AboutScreen';
import IntroScreen from '../screens/Intro/IntroScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import BusinessInfoScreen from '../screens/Profile/BusinessInfoScreen';
import PersonalInfoScreen from '../screens/Profile/PersonalInfoScreen';
import CompleteInfoScreen from '../screens/Profile/CompleteInfoScreen';
import CardSwiperScreen from '../screens/Matching/CardSwiperScreen';
import CardProfileScreen from '../screens/Matching/CardProfileScreen';
import UpdateInfoScreen from '../screens/Profile/UpdateInfoScreen';
import InitialScreen from '../screens/Intro/InitialScreen';
import SettingScreen from '../screens/Setting/SettingScreen';
import ChatListScreen from '../screens/Chat/ChatListScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import {SocketContextProvider} from '../contexts';
import useBzWebSockets from '../hooks/useBzWebsocket';
import {RootState} from '../redux/store';
import useBzNotification from '../hooks/useBzNotification';
import {setCurrentScreen} from '../redux/global/globalStateSlice';

export type StackParamList = {
  INITIAL: undefined;
  ABOUT: undefined;
  INTRO: undefined;
  LOGIN: undefined;
  SETTING: undefined;
  BUSINESS_INFO: undefined;
  PERSONAL_INFO: undefined;
  COMPLETE_INFO: undefined;
  UPDATE_INFO: undefined;
  CARD_SWIPER: undefined;
  CARD_PROFILE: {user: any};
  CHAT_LIST: undefined;
  CHAT: {chatUser: any; change?: boolean};
  FAST_MESSAGE: {chatUser: any};
};

const Stack = createNativeStackNavigator<StackParamList>();

const AppNavigation = () => {
  const socket = useBzWebSockets();
  const dispatch = useDispatch();
  const globalState = useSelector((state: RootState) => state.globalState);
  const appState = useRef(AppState.currentState);
  const {displayNotification} = useBzNotification();

  useEffect(() => {
    dispatch(setCurrentScreen({currentScreen: ''}));
    const appStateSubs = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });

    return () => {
      appStateSubs.remove();
    };
  }, []);

  useEffect(() => {
    socket?.on('sent-message', (payload: any) => {
      if (+payload.receiver_id === globalState.userId) {
        const payloadCurrentScreen = `ChatScreen-${payload.sender_id}`;
        if (
          globalState.currentScreen !== payloadCurrentScreen ||
          appState.current !== 'active'
        ) {
          displayNotification(payload.sender_name, payload.message);
        }
      }
    });

    return () => {
      socket?.off('sent-message');
    };
  }, [socket]);

  return (
    <SocketContextProvider value={socket}>
      <Stack.Navigator
        initialRouteName="INITIAL"
        screenOptions={() => ({
          gestureEnabled: false,
          headerShown: false,
          animation: 'default',
        })}>
        <Stack.Group>
          <Stack.Screen name="INITIAL" component={InitialScreen} />
          <Stack.Screen name="ABOUT" component={AboutScreen} />
          <Stack.Screen name="INTRO" component={IntroScreen} />
          <Stack.Screen name="LOGIN" component={LoginScreen} />
          <Stack.Screen name="BUSINESS_INFO" component={BusinessInfoScreen} />
          <Stack.Screen name="PERSONAL_INFO" component={PersonalInfoScreen} />
          <Stack.Screen name="COMPLETE_INFO" component={CompleteInfoScreen} />
          <Stack.Screen name="CARD_SWIPER" component={CardSwiperScreen} />
          <Stack.Screen name="CARD_PROFILE" component={CardProfileScreen} />
          <Stack.Screen name="UPDATE_INFO" component={UpdateInfoScreen} />
          <Stack.Screen name="CHAT_LIST" component={ChatListScreen} />
          <Stack.Screen name="CHAT" component={ChatScreen} />
          <Stack.Screen name="SETTING" component={SettingScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </SocketContextProvider>
  );
};

export default AppNavigation;
