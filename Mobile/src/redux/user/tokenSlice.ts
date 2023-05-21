import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  accessToken: '',
  refreshToken: '',
};

export const tokenSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, {payload}) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
    },
    removeToken: () => initialState,
  },
  extraReducers: builder => {},
});

export const {setToken, removeToken} = tokenSlice.actions;

export default tokenSlice.reducer;
