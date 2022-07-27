import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAuthStatus, UserWithStats } from "../interfaces/Common.interface";
import { updateSavedUserData } from "../services/userServices";

const initialState: {
  user: UserWithStats | null;
  status: UserAuthStatus;
  token: string | null;
} = {
  user: null,
  status: UserAuthStatus.LOADING,
  token: null,
};

export const updateUser = createAsyncThunk("user/updateUser", async () => {
  return updateSavedUserData();
});

export const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    login(
      state,
      action: PayloadAction<{ user: UserWithStats; token: string }>
    ) {
      state.user = action.payload.user;
      state.status = UserAuthStatus.AUTHENTICATED;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = null;
      state.status = UserAuthStatus.UNAUTHENTICATED;
      state.token = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = JSON.parse(JSON.stringify(action.payload.data.data));
    });
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
