//Importa o Mongoose, uma biblioteca do Node.js que facilita a interação com bancos de dados MongoDB.
const mongoose = require("mongoose")

//connection

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const conn = async () => {
    try {

        const dbConn = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.klheeht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
        );

        console.log('Conectou ao banco!');

        return dbConn

    } catch (error) {
        console.log(error)
    }

}

conn();


module.exports = conn;


//mongodb
//usuario: marcusviniciusam92 senha: LC27tRACgosJ0sYW 