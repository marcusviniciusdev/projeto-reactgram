const User = require("../models/User");
//Uma biblioteca para hashing de senhas usando o algoritmo bcrypt.
const bcrypt = require("bcryptjs");
//criação e verificação de tokens JWT (JSON Web Tokens) em uma aplicação Node.js
const jwt = require("jsonwebtoken");

const { default: mongoose } = require("mongoose");


//pegando a chave
const jwtSecret = process.env.JWT_SECRET;

//FUNÇÃO LOCAL AUXILIAR PARA GERAÇÃO DE TOKEN
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d",
    });
};
//FUNÇÃO DE REGISTRAR USUARIO E LOGAR

const register = async (req, res) => {
    //captando o name, email e password que chegam da requisição
    const { name, email, password } = req.body

    //checar se o usuário existe, a função findone é do moongoose

    const user = await User.findOne({ email })

    if (user) {
        res.status(422).json({ errors: ["Por favor utilize outro e-mail"] })
        return
    }

    //gerar senha
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //criação do usuário
    const newUser = await User.create({
        name,
        email,
        password: passwordHash, //irar ser salvo como password no bando de dados, mas precisamos utilizar passwordHash que contem a senha encriptada
    });

    //checar se usuário foi criado com sucesso
    if (!newUser) {
        res.status(422).json({
            errors: ["Houve um erro, por favor tente novamente mais tarde."],
        });
        return;
    }
    // retornar o token
    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id),
    })


}

//FUNÇÃO DE LOGIN
const login = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Checar se usuário existe
    if (!user) {
        res.status(404).json({ errors: ["Usuário não encontrado!"] });
        return;
    }

    // Checar se a senha está correta
    if (!(await bcrypt.compare(password, user.password))) {
        res.status(422).json({ errors: ["Senha inválida!"] });
        return;
    }

    // retornar usuario e token
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id),
    });

};

//OBTER USUÁRIO LOGADO
const getCurrentUser = async (req, res) => {

    const user = req.user;

    res.status(200).json(user);
};

//FUNÇÃO DE UPDATE DE USUÁRIO

const update = async (req, res) => {

    //captando os dados da requisição
    const { name, password, bio } = req.body;


    let profileImage = null;

    //verifica se existe o arquivo
    if (req.file) {
        profileImage = req.file.filename;
    }

    //usuário da requisição que foi salvo na autenticação na hora do login com o token
    const reqUser = req.user;

   
    // Este código está buscando um documento de usuário específico no banco de dados MongoDB usando o ID do usuário (reqUser._id). Ele garante que o ID seja do tipo ObjectId e exclui o campo password dos resultados da consulta para proteger as informações sensíveis do usuário.
    const { ObjectId } = mongoose.Types;

    const user = await User.findById(new ObjectId(reqUser._id)).select("-password");

    //verifica se o novo nome que usuário está atualizando chegou
    if (name) {
        user.name = name;
    }

    //verifica se o password chegou
    if (password) {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        //captando a nova senha que o usuário está atualizando
        user.password = passwordHash;
    }

    //se o usuario está atualizando a imagem do perfil
    if (profileImage) {
        user.profileImage = profileImage;
    }

    //se está atualizando a bio
    if (bio) {
        user.bio = bio;
    }

    //salvando no banco
    await user.save();

    res.status(200).json(user);

}

// CAPTANDO O USUÁRIO PELO ID

const getUserById = async (req, res) => {

    const { id } = req.params;

    try {

        const { ObjectId } = mongoose.Types;

        const user = await User.findById(new ObjectId(id)).select("-password");

        // checando se o usuário existe
        if (!user) {
            res.status(404).json({ errors: ["Usuário não encontrado!"] });
            return;
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(404).json({ errors: ["Usuário não encontrado!"] });
        return;
    }

};




module.exports = {
    register,
    getCurrentUser,
    login,
    update,
    getUserById

}