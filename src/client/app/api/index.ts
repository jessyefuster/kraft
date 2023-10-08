import { AnyAction, AsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { AuthLoginBody, AuthLoginResponse } from '../../lib/api/models/auth';
import { UserDTO, UsersListResponse } from '../../lib/api/models/users';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User', 'UNAUTHORIZED'],
  endpoints: (builder) => ({
    logIn: builder.mutation<AuthLoginResponse, AuthLoginBody>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body
      }),
      invalidatesTags: (result) => result ? ['UNAUTHORIZED'] : []
    }),
    logOut: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      })
    }),
    getAuthentication: builder.mutation<undefined, void>({
      query: () => '/auth/authenticated'
    }),
    getUsers: builder.query<UsersListResponse, void>({
      query: () => '/users',
      providesTags: (result, error) => error?.status === 401
        ? ['User', 'UNAUTHORIZED']
        : ['User']
    }),
    deleteUser: builder.mutation<unknown, UserDTO['id']>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    }),
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
  useGetAuthenticationMutation,
  useGetUsersQuery,
  useDeleteUserMutation
} = api;
