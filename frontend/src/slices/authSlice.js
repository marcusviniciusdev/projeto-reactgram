//createSlice: Esta função é usada para criar um slice (fatia) do estado global da aplicação.
//createAsyncThunk: Esta função é usada para criar ações assíncronas que podem ser despachadas (dispatched) em um store Redux. Ela facilita a definição de lógica assíncrona, como chamadas de API, e lida com o ciclo de vida da promise (pendente, resolvida, rejeitada).
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

//captando o usuário que foi registrado no localStorage do navegador
const user = JSON.parse(localStorage.getItem("user"));

//declarando o estado inicial
const initialState = {
    user: user ? user : null,
    error: false,
    success: false,
    loading: false,
  };

// O código define uma ação assíncrona usando createAsyncThunk do Redux Toolkit, destinada ao registro de um usuário. Essa ação faz uma chamada ao serviço de autenticação (authService) para registrar um novo usuário e lida com a resposta, incluindo possíveis erros.
export const register = createAsyncThunk(
    "auth/register",
    async (user, thunkAPI) => {
        //aqui é a chamada ao serviço criado que busca pela rota do backend
        const data = await authService.register(user);

        // checamos se teve erro, se sim, cancela a ação
        if (data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0]);
          }

        return data;
    }
);

// Logout do usuário, 
export const logout = createAsyncThunk("auth/logout", async () => {
    await authService.logout();
});

// login do usuário
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
    const data = await authService.login(user);

    // Checando se tem erros
    if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
});

// este slice do Redux gerencia o estado de autenticação da aplicação, incluindo o estado de carregamento (loading), sucesso (success), erro (error), e informações do usuário (user). Ele define reducers para manipular ações assíncronas de registro, login e logout, atualizando o estado conforme necessário com base no resultado dessas ações.
export const authSlice = createSlice({
    name: "auth", //Define o nome do slice, que será usado para identificar este slice no estado global do Redux.
    initialState,
    reducers: { //Define um reducer chamado reset que retorna o estado para seus valores iniciais, ou seja, loading, error, e success são definidos como false.
        reset: (state) => {
            state.loading = false;
            state.error = false;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => { //quando é sucesso
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user = action.payload; // recebe os dados do usuario
            })
            .addCase(register.rejected, (state, action) => { // quando da erro
                state.loading = false;
                state.error = action.payload; //recebe o erro 
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => { 
                state.user = null;
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
            });
    },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;

