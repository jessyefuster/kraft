import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { api } from './api';
import authSlice from '../features/Auth/store/slice';

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [authSlice.name]: authSlice.reducer
});

const persistedReducer = persistReducer({
  key: 'root',
  storage,
  blacklist: [api.reducerPath]
}, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware)
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
