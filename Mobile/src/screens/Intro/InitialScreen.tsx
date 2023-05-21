import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {API} from '../../constants';
import {useBzFetch} from '../../hooks/useBzFetch';
import {StackParamList} from '../../navigations/AppNavigation';
import {removeCards} from '../../redux/cards/matchingSlice';
import {
  resetState,
  setIsLoading,
  setUserId,
} from '../../redux/global/globalStateSlice';
import {setUser, updateAttr} from '../../redux/user/userSlice';
import {RootState} from '../../redux/store';

const InitialScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const BzFetch = useBzFetch();
  const dispatch = useDispatch();
  const {userId, isBusinessSubmitted, isPersonalSubmitted} = useSelector(
    (state: RootState) => state.globalState,
  );
  const token = useSelector((state: RootState) => state.token);

  let redirectScreen = 'CARD_SWIPER';

  useEffect(() => {
    dispatch(setIsLoading({isLoading: true}));
    BzFetch.get(API.USER_PROFILE)
      .then(({data: rs}) => {
        const {name, email, avatar, ...other} = rs.data.user;
        dispatch(setUser({name, email, avatar}));
        dispatch(updateAttr(other));

        if (userId !== other.id) {
          dispatch(removeCards());
          dispatch(resetState());
          dispatch(setUserId({userId: other.id}));
        }

        if (!isBusinessSubmitted) {
          redirectScreen = 'BUSINESS_INFO';
        } else if (!isPersonalSubmitted) {
          redirectScreen = 'PERSONAL_INFO';
        } else if (!other.status) {
          redirectScreen = 'COMPLETE_INFO';
        }

        dispatch(setIsLoading({isLoading: false}));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: redirectScreen}],
          }),
        );
      })
      .catch(err => {
        console.log(err);
        if (!token.accessToken) {
          redirectScreen = 'ABOUT';
        }

        dispatch(setIsLoading({isLoading: false}));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: redirectScreen}],
          }),
        );
      });
  }, [userId]);

  return <></>;
};

export default InitialScreen;
