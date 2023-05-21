import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  isBusinessSubmitted: false,
  isPersonalSubmitted: false,
  userId: 0,
  currentScreen: '',
};

export const globalStateSlice = createSlice({
  name: 'globalState',
  initialState,
  reducers: {
    setIsLoading: (state, {payload}) => {
      state.isLoading = payload.isLoading;
    },
    setBusinessSubmitted: state => {
      state.isBusinessSubmitted = true;
    },
    setPersonalSubmitted: state => {
      state.isPersonalSubmitted = true;
    },
    setUserId: (state, {payload}) => {
      state.userId = payload.userId;
    },
    setCurrentScreen: (state, {payload}) => {
      state.currentScreen = payload.currentScreen;
    },
    resetState: () => initialState,
  },
  extraReducers: builder => {},
});

export const {
  setIsLoading,
  setBusinessSubmitted,
  setPersonalSubmitted,
  setUserId,
  setCurrentScreen,
  resetState,
} = globalStateSlice.actions;

export default globalStateSlice.reducer;
