//Importa o Mongoose, uma biblioteca do Node.js que facilita a interação com bancos de dados MongoDB.
const mongoose = require('mongoose')
// Extrai o objeto Schema do Mongoose, usado para definir a estrutura dos documentos dentro de uma coleção MongoDB.
const { Schema } = mongoose


// Define um novo esquema chamado userSchema para o modelo de usuário. O esquema possui os seguintes campos:

// name: String para o nome do usuário.
// email: String para o email do usuário.
// password: String para a senha do usuário.
// profileImage: String para o caminho da imagem de perfil do usuário.
// bio: String para a biografia do usuário.

// O segundo argumento passado para new Schema(...) é um objeto de configuração que define timestamps: true, o que faz com que o Mongoose automaticamente adicione campos createdAt e updatedAt ao documento para rastrear quando ele foi criado e atualizado.

const userSchema = new Schema(
    {
        name: String,
        email: String,
        password: String,
        profileImage: String,
        bio: String,
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;