import type { AnyAction, AsyncThunk } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthLoginBody, AuthLoginResponse, UserDTO, UsersListResponse, RolesListResponse, RoleDTO, RolesCreateResponse, RolesCreateBody } from '@internal/types';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User', 'Role', 'UNAUTHORIZED'],
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
      providesTags: (_, error) => error?.status === 401
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
    getRoles: builder.query<RolesListResponse, void>({
      query: () => '/roles',
      providesTags: (result, error) => error?.status === 401
        ? ['Role', 'UNAUTHORIZED']
        : ['Role']
    }),
    deleteRole: builder.mutation<unknown, RoleDTO['id']>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Role']
    }),
    createRole: builder.mutation<RolesCreateResponse, RolesCreateBody>({
      query: (body) => ({
        url: '/roles',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Role']
    }),
  })
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;

export const isApiAuthRejected = (action: AnyAction): action is RejectedAction => 
  action.type.startsWith('api/') && isRejectedWithValue(action) && (action.payload as { status: number }).status === 401;

export const {
  useLogInMutation,
  useLogOutMutation,
  useGetAuthenticationMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetRolesQuery,
  useDeleteRoleMutation,
  useCreateRoleMutation,
} = api;
