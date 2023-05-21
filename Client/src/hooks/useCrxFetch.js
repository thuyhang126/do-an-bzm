import axios from "axios";
import { useNavigate } from "react-router-dom";
import appConfig from "../config/appConfig";

export const useCrxFetch = () => {
  let token = JSON.parse(localStorage.getItem('token'));
  const navigate = useNavigate();

  const refreshTokenHandle = () => {
    return crxFetch.post(appConfig.baseURL + appConfig.refreshToken);
  };

  const crxFetch = axios.create({
    baseURL: appConfig.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  crxFetch.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token.accessToken;
        config.headers['version'] = '1.1.1';
      } else {
        navigate('/login');
      }

      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );

  crxFetch.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          if (token && token.refreshToken) {
            const rs = await refreshTokenHandle();

            token.accessToken = rs.data.data.accessToken;

            localStorage.setItem('token', JSON.stringify(token));

            crxFetch.defaults.headers.common['Authorization'] = 'Bearer ' + token.accessToken;
          }

          navigate('/login');
          return crxFetch(originalConfig);
        } catch (err) {
          if (err.response && err.response.data) {
            navigate('/login');
            return Promise.reject(err.response.data);
          }

          return Promise.reject(err);
        }
      }

      if (err.response.status === 403 && err.response.data) {
        navigate('/login');
        return Promise.reject(err.response.data);
      }

      if (err.response.status === 500 && err.response.data) {
        if (originalConfig.url + process.env.BASEURL === appConfig.baseURL + appConfig.apiRefreshToken) {
          localStorage.removeItem('token');
          navigate('/login');
        }

        return Promise.reject(err.response.data);
      }

      if (err.response) {
        return Promise.reject(err);
      }
    },
  );

  return crxFetch;
};
