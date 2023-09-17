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
  })
});

export const {
  useLogInMutation,
  useLogOutMutation,
} = api;
