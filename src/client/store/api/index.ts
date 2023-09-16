import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { AuthLoginBody, AuthLoginResponse } from '../../lib/api/models/auth';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    logIn: builder.mutation({
      query: (body: AuthLoginBody) => ({
        url: '/auth/login',
        method: 'POST',
        body
      }),
      transformResponse: (response: { data: AuthLoginResponse }) => response.data
    }),
  })
});

export const {
  useLogInMutation,
} = api;
