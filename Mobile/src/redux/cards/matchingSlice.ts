import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: new Array(),
  matchedTime: 1,
};

export const matchingSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCards: (state, {payload}) => {
      state.data = payload.data;
    },
    setMatchedTime: (state, {payload}) => {
      state.matchedTime = payload.matchedTime;
    },
    setIsMatched: (state, {payload}) => {
      state.data = state.data.map((card: any) => {
        if (card.id === payload.userId) {
          card.isMatched = true;
        }

        return card;
      });
    },
    removeCards: () => initialState,
  },
  extraReducers: builder => {},
});

export const {setCards, setMatchedTime, setIsMatched, removeCards} =
  matchingSlice.actions;

export default matchingSlice.reducer;
