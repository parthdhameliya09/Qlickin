import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  mfaRequired: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  mfaRequired: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.mfaRequired = false;
      localStorage.setItem('token', action.payload.token);
    },
    setMfaRequired: (state, action: PayloadAction<boolean>) => {
      state.mfaRequired = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.mfaRequired = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, setMfaRequired, logout } = authSlice.actions;
export default authSlice.reducer;
