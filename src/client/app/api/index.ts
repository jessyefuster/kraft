import { AnyAction, AsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { AuthLoginBody, AuthLoginResponse } from '../../lib/api/models/auth';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    logIn: builder.mutation<AuthLoginResponse, AuthLoginBody>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body
      })
    }),
    logOut: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      })
    }),
    getAuthentication: builder.mutation<undefined, void>({
      query: () => '/auth/authenticated'
    })
  })
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;

export const isApiAuthRejected = (action: AnyAction): action is RejectedAction => {
  return action.type.startsWith('api/') && isRejectedWithValue(action) && (action.payload as { status: number; }).status === 401;
}

export const {
  useLogInMutation,
  useLogOutMutation,
  useGetAuthenticationMutation
} = api;