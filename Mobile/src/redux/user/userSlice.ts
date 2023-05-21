import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  avatar: '',
  attr: {} as any,
};

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, {payload}) => {
      state.name = payload.name;
      state.email = payload.email;
      state.avatar = payload.avatar;
    },
    setAttr: (state, {payload}) => {
      state.attr = payload;
    },
    updateAttr: (state, {payload}) => {
      state.attr = {...state.attr, ...payload};
    },
    removeUser: () => initialState,
  },
  extraReducers: builder => {},
});

export const {setUser, setAttr, updateAttr, removeUser} = authSlice.actions;

export default authSlice.reducer;
