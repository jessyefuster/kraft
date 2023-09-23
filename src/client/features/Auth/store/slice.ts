import { createSlice } from '@reduxjs/toolkit';

import { User } from '../../Users/models';
import { api, isApiAuthRejected } from '../../../app/api';

type AuthState = {
  user?: User | null;
};

const initialState: AuthState = {
  user: undefined
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.logIn.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
      }
    );
    builder.addMatcher(
      api.endpoints.logOut.matchFulfilled,
      (state) => {
        state.user = null;
      }
    );
    builder.addMatcher(
      isApiAuthRejected,
      (state) => {
        state.user = null;
      }
    );
  }
});

export default slice;
