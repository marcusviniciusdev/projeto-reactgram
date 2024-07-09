// Esse arquivo define algumas constantes e uma função para configurar requisições HTTP, facilitando a comunicação entre o front-end e o back-end da sua aplicação. 

export const api = "http://localhost:5001/api"

export const uploads = "http://localhost:5001/uploads";
// A função requestConfig cria e retorna um objeto de configuração para uma requisição HTTP. Essa configuração pode ser usada com o fetch ou qualquer outra biblioteca de requisições HTTP.
export const requestConfig = (method, data, token = null, image = null) => {

    let config

    if (image) {
        config = {
            method,
            body: data,
            headers: {}
        }
    } else if (method === "DELETE" || data === null) {
        config = {
            method,
            headers: {}
        }
    } else {
        config = {
            method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }
    }

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config

}