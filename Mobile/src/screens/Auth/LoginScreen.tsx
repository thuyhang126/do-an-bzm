import React, {useEffect, useState} from 'react';
import {Dimensions, Image, Platform, StyleSheet, View} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {useDispatch} from 'react-redux';

import {API, IMAGE} from '../../constants';
import BzButton from '../../components/BzButton';
import {useBzFetch} from '../../hooks/useBzFetch';
import {setToken} from '../../redux/user/tokenSlice';
import {setIsLoading} from '../../redux/global/globalStateSlice';
import BzCustomHeader from '../../components/BzCustomHeader';
import {StackParamList} from '../../navigations/AppNavigation';

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const dispatch = useDispatch();
  const BzFetch = useBzFetch();
  const [isLoginSuccessfully, setIsLoginSuccessfully] = useState(false);

  const onAppleStoreButtonPress = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      console.log(appleAuthRequestResponse.identityToken);
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }
      const {identityToken, nonce} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );
      const user = auth().signInWithCredential(appleCredential);
      const firebaseIdToken = await auth().currentUser?.getIdToken();
      const rs = await BzFetch.post(API.LOGIN, {
        token: firebaseIdToken,
        provider: 'apple-store',
      });
      const {accessToken, refreshToken} = rs.data.data;
      dispatch(setToken({accessToken, refreshToken}));
      dispatch(setIsLoading({isLoading: false}));
    } catch (err) {
      dispatch(setIsLoading({isLoading: false}));
      throw err;
    }
  };

  const onGoogleButtonPress = async () => {
    dispatch(setIsLoading({isLoading: true}));
    try {
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const user = await auth().signInWithCredential(googleCredential);
      const firebaseIdToken = await auth().currentUser?.getIdToken();
      const rs = await BzFetch.post(API.LOGIN, {
        token: firebaseIdToken,
        provider: 'google',
      });

      const {accessToken, refreshToken} = rs.data.data;
      dispatch(setToken({accessToken, refreshToken}));

      dispatch(setIsLoading({isLoading: false}));
    } catch (err) {
      dispatch(setIsLoading({isLoading: false}));
      throw err;
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '6530740495-rrkogjbq61k5rbqt8jttjhni5uu6juf7.apps.googleusercontent.com',
    });
  }, []);

  return (
    <>
      <BzCustomHeader />
      <View style={[styles.wrapper, {opacity: isLoginSuccessfully ? 0 : 1}]}>
        <Image source={IMAGE.LOGO} style={styles.logo} />

        {Platform.OS == 'ios' ? (
          <View style={styles.loginButtonWrapper}>
            <BzButton
              style={[styles.loginButton, {backgroundColor: '#C4C4C4'}]}
              iconImageSource={IMAGE.ICON_APPLE}
              title="Đăng nhập bằng Apple"
              titleStyle={styles.loginTitleStyle}
              contentWrapperStyle={styles.loginButtonContentWrapper}
              onPress={() => {
                onAppleStoreButtonPress()
                  .then(() => {
                    setIsLoginSuccessfully(true);
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{name: 'INITIAL'}],
                      }),
                    );
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }}
            />
          </View>
        ) : (
          ''
        )}

        <View style={styles.loginButtonWrapper}>
          <BzButton
            style={[styles.loginButton, {backgroundColor: '#C0E087'}]}
            iconImageSource={IMAGE.ICON_GMAIL}
            title="Đăng nhập bằng Google"
            titleStyle={styles.loginTitleStyle}
            contentWrapperStyle={styles.loginButtonContentWrapper}
            onPress={() => {
              onGoogleButtonPress()
                .then(() => {
                  setIsLoginSuccessfully(true);
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'INITIAL'}],
                    }),
                  );
                })
                .catch(err => {
                  console.log(err);
                  GoogleSignin.signOut();
                });
            }}
          />
        </View>

        {/* <View style={styles.loginButtonWrapper}>
        <BzButton
          style={styles.loginButton}
          iconImageSource={IMAGE.ICON_FACEBOOK}
          title="Đăng nhập bằng Facebook"
          titleStyle={styles.loginTitleStyle}
          contentWrapperStyle={styles.loginButtonContentWrapper}
          onPress={() => {}}
        />
      </View> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 235,
    height: 80,
    marginBottom: 85,
  },
  loginButtonWrapper: {
    marginBottom: 20,
  },
  loginButton: {
    width: Math.floor(Dimensions.get('window').width * 0.85),
    alignItems: 'flex-start',
  },
  loginTitleStyle: {
    textTransform: 'none',
  },
  loginButtonContentWrapper: {
    flexDirection: 'row',
    marginLeft: 40,
  },
});

export default LoginScreen;
