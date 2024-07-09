// Este middleware proteje o back end de algum usuário acessar rotas que necessitam de autenticação
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {

    //objetivo de obter o valor do cabeçalho HTTP Authorization da requisição recebida. 
    const authHeader = req.headers["authorization"];

    //verificação da existência do cabeçalho de autorização (authHeader) e a extração do token de autenticação se o cabeçalho estiver presente. 
    const token = authHeader && authHeader.split(" ")[1];

    //verificando se o cabeçalho da requisição tem o token

    if (!token) return res.status(401).json({ errors: ["Acesso negado!"] });

    //chegando se o token é valido
    try {

        //aplicando um metodo de verificação do jwt com o token e a chave secreta
        const verified = jwt.verify(token, jwtSecret);

        // Consultando os dados do usuário: Está buscando no banco de dados o usuário cujo ID é verified.id.
        // Ignorando a senha: Está excluindo o campo password dos resultados da consulta, pois a senha não é necessária para as operações subsequentes e por motivos de segurança.
        // Guardando os dados em uma variável: Está atribuindo os dados do usuário (sem a senha) à propriedade user do objeto de requisição (req). Isso permite que outras partes da aplicação, como rotas e middlewares, possam acessar as informações do usuário autenticado através de req.user.
        req.user = await User.findById(verified.id).select("-password");

        next();


    } catch (error) {
        res.status(401).json({ errors: ["Token Inválido"] })
    }
}
module.exports = authGuard