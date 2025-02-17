import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../../Interface/Users';

interface AuthState {
  user: UserState | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload;
      state.user.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;