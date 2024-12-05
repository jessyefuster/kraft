import type { AnyAction, AsyncThunk } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  AuthLoginBody,
  AuthLoginResponse,
  UserDTO,
  UsersListResponse,
  RolesListResponse,
  RoleDTO,
  RolesCreateResponse,
  RolesCreateBody,
  RoleGetResponse,
  RoleEditResponse,
  RoleEditBody,
  RolePermissionsGetResponse,
  PermissionsListResponse,
  RolePermissionsUpdateResponse,
  RolePermissionsUpdateBody,
  RolePermissionsAddResponse,
  RolePermissionsAddBody,
  UsersCreateResponse,
  UsersCreateBody
} from '@internal/types';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User', 'Role', 'Permission', 'UNAUTHORIZED'],
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
    createUser: builder.mutation<UsersCreateResponse, UsersCreateBody>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body
      }),
      invalidatesTags: ['User']
    }),
    getRoles: builder.query<RolesListResponse, void>({
      query: () => '/roles',
      providesTags: (result, error) => error?.status === 401
        ? ['Role', 'UNAUTHORIZED']
        : ['Role']
    }),
    getRole: builder.query<RoleGetResponse, RoleDTO['id']>({
      query: (id) => `/roles/${id}`,
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
    editRole: builder.mutation<RoleEditResponse, { id: RoleDTO['id']; body: RoleEditBody }>({
      query: ({ id, body = undefined }) => ({
        url: `/roles/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Role']
    }),
    getRolePermissions: builder.query<RolePermissionsGetResponse, RoleDTO['id']>({
      query: (id) => `/roles/${id}/permissions`,
      providesTags: (result, error) => error?.status === 401
        ? ['Role', 'UNAUTHORIZED']
        : ['Role']
    }),
    updateRolePermissions: builder.mutation<RolePermissionsUpdateResponse, { id: RoleDTO['id']; body: RolePermissionsUpdateBody }>({
      query: ({ id, body = undefined }) => ({
        url: `/roles/${id}/permissions`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Role']
    }),
    addRolePermissions: builder.mutation<RolePermissionsAddResponse, { id: RoleDTO['id']; body: RolePermissionsAddBody }>({
      query: ({ id, body = undefined }) => ({
        url: `/roles/${id}/permissions`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Role']
    }),
    getPermissions: builder.query<PermissionsListResponse, void>({
      query: () => '/permissions',
      providesTags: (result, error) => error?.status === 401
        ? ['Permission', 'UNAUTHORIZED']
        : ['Permission']
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
  useCreateUserMutation,
  useGetRolesQuery,
  useGetRoleQuery,
  useDeleteRoleMutation,
  useCreateRoleMutation,
  useEditRoleMutation,
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
  useAddRolePermissionsMutation,
  useGetPermissionsQuery
} = api;
