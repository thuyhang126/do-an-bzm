import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import GoogleIcon from '@mui/icons-material/Google';
import { ErrorMessage } from '@hookform/error-message';
import { useForm } from 'react-hook-form';
import appConfig from '../../config/appConfig';

import { auth, provider } from '../../utilities/firebase';
import { signInWithPopup } from 'firebase/auth';
import { Box } from '@mui/joy';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function Login() {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    criteriaMode: 'all',
  });
  const onSubmit = (data) => {
    console.log(data);
    axios
      .post(`${appConfig.portServer}/api/auth/login`, data)
      .then((response) => {
        console.log('response', response);
        if (response.data.status === 200) {
          localStorage.setItem(
            'token',
            JSON.stringify({
              accessToken: response.data.data.accessToken,
              refreshToken: response.data.data.refreshToken,
            }),
          );
          const { id, name, avatar } = response.data.data.user;
          localStorage.setItem('user', JSON.stringify({ id, name, avatar }));
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loginGoogle = () => {
    signInWithPopup(auth, provider).then((res) => {
      const token = res._tokenResponse.idToken;

      console.log(token);

      axios
        .post('http://localhost:8000/api/auth/login', {
          provider: 'google',
          token,
        })
        .then((response) => {
          console.log('response', response);
          if (response.data.status === 200) {
            localStorage.setItem(
              'token',
              JSON.stringify({
                accessToken: response.data.data.accessToken,
                refreshToken: response.data.data.refreshToken,
              }),
            );
            const { id, name, avatar } = response.data.data.user;
            localStorage.setItem('user', JSON.stringify({ id, name, avatar }));
            navigate('/following');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <div className={cx('wrapper')}>
      <Grid item xs={2}>
        <Box component={MuiLink} href="#" variant="body1" color="white" onClick={loginGoogle}>
          <GoogleIcon color="#a52a2a"/>
        </Box>
      </Grid>

      <form className={cx('reactHookForm')} onSubmit={handleSubmit(onSubmit)}>
        <h1>Đăng nhập</h1>
        <h2>Email</h2>
        <input
          {...register('email', {
            required: 'Email Address is required',
            pattern: {
              value:
                // eslint-disable-next-line no-useless-escape
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'Email khoo hop le.',
            },
          })}
        />
        <ErrorMessage
          errors={errors}
          name="email"
          render={({ messages }) => {
            console.log('messages', messages);
            return messages ? Object.entries(messages).map(([type, message]) => <p key={type}>{message}</p>) : null;
          }}
        />
        <h2>Password</h2>
        <input
          {...register('password', {
            required: 'Password is required.',
            minLength: {
              value: 6,
              message: 'Password must exceed 5 characters',
            },
          })}
        />
        <ErrorMessage
          errors={errors}
          name="password"
          render={({ messages }) => {
            console.log('messages', messages);
            return messages ? Object.entries(messages).map(([type, message]) => <p key={type}>{message}</p>) : null;
          }}
        />
        <input className={cx('submit')} type="submit"/>
        <img src={images.bizLogo} alt="Biz"></img>
      </form>
    </div>
  );
}

export default Login;
