import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../services/userService';


const initialState = {
  user: {},
  error: false,
  success: false,
  loading: false,
  message: null
};


//ações 

//capta os detalhes do usuario
export const profile = createAsyncThunk(
  "user/profile",
  async (user, thunkAPI) => {

    //buscando o token lá do authslice
    const token = thunkAPI.getState().auth.user.token

    const data = await userService.profile(user, token);
    return data;

  }
)

//atualizacao dos detalhes do usuario
export const updateProfile = createAsyncThunk(
  "user/update",
  async (user, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await userService.updateProfile(user, token);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    console.log(data);

    return data;
  }
);

export const getUserDetails = createAsyncThunk(
  "user/get",
  async (id, thunkAPI) => {

    const data = await userService.getUserDetails(id);

    return data;
  }
);



export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(profile.fulfilled, (state, action) => { //quando é sucesso
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload; // recebe os dados do usuario
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
        state.message = "Usuário atualizado com sucesso!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = {};
      })
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => { //quando é sucesso
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload; // recebe os dados do usuario
      })


  }
});


export const { resetMessage } = userSlice.actions;

export default userSlice.reducer;