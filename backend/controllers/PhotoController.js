const { Result } = require("express-validator");
const Photo = require("../models/Photo")
const User = require("../models/User");
const mongoose = require("mongoose")

// Inserindo uma foto com um usuário relacionado a ela

const insertPhoto = async (req, res) => {

    const { title } = req.body;
    const image = req.file.filename;

    console.log(req.body);

    //captar o usuário
    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    console.log(user.name);

    // Criando a foto
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    });

    // Se o usuário tirou a foto com sucesso, retorne os dados
    if (!newPhoto) {
        res.status(422).json({
            errors: ["Houve um erro, por favor tente novamente mais tarde."],
        });
        return;
    }

    res.status(201).json(newPhoto);
};

//removendo a foto

const deletePhoto = async (req, res) => {

    //pegando o id da photo pela url
    const { id } = req.params;

    //captando o usuário pela requisição
    const reqUser = req.user;

    try {

        const photo = await Photo.findById(id);

        // Checando se a foto existe
        if (!photo) {
            res.status(404).json({ errors: ["Foto não encontrada!"] });
            return;
        }

        // checando se a foto pertece ao usuário que quer excluir
        if (!photo.userId.equals(reqUser._id)) {
            res
                .status(422)
                .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
            return;
        }

        await Photo.findByIdAndDelete(photo._id);

        res
            .status(200)
            .json({ id: photo._id, message: "Foto excluída com sucesso." });

    } catch (error) {
        res
            .status(404)
            .json({ errors: ["Foto não encontrada"] });
        return
    }

};

//Resgatando todas as fotos
const getAllPhotos = async (req, res) => {


    // Photo.find({}): Faz uma busca por todos os documentos na coleção Photo. O objeto vazio {} como argumento indica que não há filtros, ou seja, todos os documentos serão retornados.

    // .sort([["createdAt", -1]]): Ordena os documentos retornados pela data de criação (createdAt) em ordem decrescente. O -1 indica ordem decrescente. Esse array de arrays é uma forma de especificar múltiplos critérios de ordenação, embora neste caso haja apenas um critério.

    // .exec(): Executa a query e retorna uma Promise. Esse método é necessário porque find() e sort() retornam um objeto Query que precisa ser executado para obter os resultados.

    // const photos = await ...: Usa await para esperar a resolução da Promise retornada por exec(), armazenando o resultado na variável photos. O uso de await indica que essa linha está dentro de uma função assíncrona.
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();

    return res.status(200).json(photos)


}

//Resgatando todas as fotos do usuário

const getUserPhotos = async (req, res) => {

    const { id } = req.params

    const photos = await Photo.find({ userId: id })
        .sort([["createdAt", -1]])
        .exec()

    return res.status(200).json(photos)
}

//Pegando foto por id
const getPhotoById = async (req, res) => {

    //pega o id pela url
    const { id } = req.params


    const photo = await Photo.findById(id)

    //checando se a foto existe
    if (!photo) {

        res.status(404).json({ errors: ["Photo não encontrada."] })
        return

    }

    return res.status(200).json(photo);
}

//Atualizando foto

const updatePhoto = async (req, res) => {

    //captando o id da foto que irá ser atualizada
    const { id } = req.params
    //é usado para acessar dados enviados no corpo da requisição, como o title
    const { title } = req.body

    const reqUser = req.user

    const photo = await Photo.findById(id)

    //checar se a foto existe

    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] })
        return
    }

    //checar se a foto pertence ao usuário
    if (!photo.userId.equals(reqUser._id)) {
        res.status(422).json({ errors: ["Ocorreu um erro, por favor tente novamente mais tarde!"] })
        return
    }

    if (title) {
        photo.title = title
    }

    await photo.save();

    res.status(200).json({ photo, message: "Foto atualizada com sucesso!" })

}

//funcionalidade de like na foto
const likePhoto = async (req, res) => {

    const { id } = req.params;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // checar se a foto existe
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] });
        return;
    }

    // checando se o usuário já deu like
    if (photo.likes.includes(reqUser._id)) {
        res.status(422).json({ errors: ["Você já curtiu esta foto."] });
        return;
    }

    // Coloque o ID do usuário em uma série de curtidas
    photo.likes.push(reqUser._id);

    await photo.save();

    res
        .status(200)
        .json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida!" });
};

// função de comentário
const commentPhoto = async (req, res) => {

    const { id } = req.params;
    const { comment } = req.body;

    //req.user vem do middleware useguard
    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id);

    // checando se a foto existe
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] });
        return;
    }

    // adicionando o comentário no array de comentários da foto
    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id,
    };

    photo.comments.push(userComment);

    await photo.save();

    res.status(200).json({
        comment: userComment,
        message: "Comentário adicionado com sucesso!",
    });
};

// procurar a foto pelo titulo
const searchPhotos = async (req, res) => {
    const { q } = req.query;
    // esse trecho de código realiza uma consulta ao banco de dados MongoDB utilizando o Mongoose. A busca é feita na coleção Photo em que o campo title corresponde a uma expressão regular case-insensitive baseada no valor da variável q. O resultado da consulta é armazenado na constante photos para posterior processamento ou exibição.
    const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

    res.status(200).json(photos);
};

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos,
}