import { api, requestConfig } from "../utils/config";


//Registro de usuários

const register = async (data) => {
    const config = requestConfig("POST", data);

    try {

        const res = await fetch(api + "/users/register", config)
            .then((res) => res.json())
            .catch((err) => err);

            if (res._id) {
            //recebendo o id e o token do usuário do backend, aqui salvando na localstorage, para extrair depois para ver se o usuário esta logado ou não.
            localStorage.setItem("user", JSON.stringify(res))
        }

        return res


    } catch (error) {
        console.log(error)
    }
};

//logout do usuário
const logout = () => {
    localStorage.removeItem("user")
}

//login do usuário
const login = async (data) => {

    const config = requestConfig("POST", data);

    try {

        const res = await fetch(api + "/users/login", config)
            .then((res) => res.json())
            .catch((err) => err);


            console.log(res)

        if (res._id) {
            //recebendo o id e o token do usuário do backend, aqui salvando na localstorage, para extrair depois para ver se o usuário esta logado ou não.
            localStorage.setItem("user", JSON.stringify(res))
        }

        return res;

    } catch (error) {
        console.log(error)
    }


}

const authService = {
    register,
    logout, 
    login
}

export default authService;
