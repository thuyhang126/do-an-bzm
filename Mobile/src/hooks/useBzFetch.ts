import {CommonActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';

import {API} from '../constants';
import {removeToken, setToken} from '../redux/user/tokenSlice';
import {removeUser} from '../redux/user/userSlice';
import {StackParamList} from '../navigations/AppNavigation';
import {RootState} from '../redux/store';

export const useBzFetch = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token);

  const refreshTokenHandle = (refreshToken: any) => {
    return BzFetch.post(API.TOKEN_REFRESH, {
      refresh_token: refreshToken,
    });
  };

  const BzFetch = axios.create({
    baseURL: API.API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  BzFetch.interceptors.request.use(
    (config: any) => {
      const {accessToken} = token;
      if (accessToken) {
        config.headers['Authorization'] = 'Bearer ' + accessToken;
      }

      return config;
    },
    err => {
      return Promise.reject(err);
    },
  );

  BzFetch.interceptors.response.use(
    res => {
      return res;
    },
    async (err: any) => {
      const originalConfig = err.config;
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const {refreshToken} = token;
          if (refreshToken) {
            const rs = await refreshTokenHandle(refreshToken);
            const {accessToken} = rs.data.data;

            dispatch(
              setToken({
                accessToken,
                refreshToken,
              }),
            );
            BzFetch.defaults.headers.common['Authorization'] =
              'Bearer ' + accessToken;
          }

          return BzFetch(originalConfig);
        } catch (err: any) {
          if (err.response && err.response.data) {
            return Promise.reject(err.response.data);
          }

          return Promise.reject(err);
        }
      }

      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }

      if (err.response.status === 400 && err.response.data) {
        if (originalConfig.url === API.TOKEN_REFRESH) {
          dispatch(removeUser());
          dispatch(removeToken());
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'LOGIN'}],
            }),
          );
        }

        return Promise.reject(err.response.data);
      }

      if (err.response) {
        return Promise.reject(err);
      }
    },
  );

  return BzFetch;
};
