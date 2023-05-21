import React from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import appConfig from '../../config/appConfig';

import './index.css';
import images from '~/assets/images';


export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    criteriaMode: 'all',
  });
  const onSubmit = (data) => {
    axios
      .post(`${appConfig.portServer}/api/auth/register`, data)
      .then((res) => {
        if (res.data.status === 200) navigate('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form className='reactHookForm' onSubmit={handleSubmit(onSubmit)}>
      <h1>Đăng ký</h1>
      <h2>Email</h2>
      <input
        {...register('email', {
          required: 'Email Address is required',
          pattern: {
            value:
              // eslint-disable-next-line no-useless-escape
              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Email không hợp lệ',
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
      <h2>Name</h2>
      <input {...register('name', { required: true })} aria-invalid={errors.name ? 'true' : 'false'} />
      {errors.name?.type === 'required' && <p>Name is required</p>}
      <input className='submit' type="submit" />
      <img src={images.bizLogo} alt="Biz"></img>
    </form>
  );
}
