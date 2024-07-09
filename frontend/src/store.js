//configuração de uma aplicação usando Redux com a biblioteca @reduxjs/toolkit. 
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice"
import photoReducer from "./slices/photoSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        photo:photoReducer

    },
})

// Configuração da Store: O código configura a store do Redux com o authReducer, tornando o estado de autenticação disponível sob a chave auth.

// Disponibilidade Global: Ao envolver a aplicação com o Provider do react-redux, a store configurada se torna disponível para todos os componentes da aplicação.

// Acesso ao Estado: Qualquer componente pode usar o hook useSelector para acessar o estado gerenciado pelo authSlice.


//o que é store do redux:

// A store do Redux é um objeto central que mantém o estado global da aplicação. Ela é a única fonte de verdade para o estado da aplicação, permitindo que você gerencie e coordene o estado de forma previsível e centralizada.