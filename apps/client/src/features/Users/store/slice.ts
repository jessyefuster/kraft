import { createSlice } from '@reduxjs/toolkit';

import type { UserDTO } from '@internal/types';

type UserId = UserDTO['id'];

type UsersState = {
  byId: Record<UserId, UserDTO>;
  allIds: UserId[];
};

const initialState: UsersState = {
  byId: {},
  allIds: []
};

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {}
});

export default slice;
