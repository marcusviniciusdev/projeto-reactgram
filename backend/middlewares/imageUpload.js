//middleware para Node.js utilizado para lidar com uploads de arquivos em aplicações web.
const multer = require("multer");
//módulo embutido do Node.js utilizado para trabalhar com caminhos de arquivos e diretórios.
const path = require("path");

//local onde o arquivo da imagem vai ser salvo
const imageStorage = multer.diskStorage({

    //tratamento de destino
    destination: function (req, file, cb) {
        let folder = "";

        //verifica se a requisição está relacionada a uma rota que inclui "users" em seu baseUrl e, se for o caso, define a pasta de destino como "users".
        if (req.baseUrl.includes("users")) {
            folder = "users"
        } else if (req.baseUrl.includes("photos")) {
            folder = "photos"
        }

        //callback de configuração do destino da imagem
        cb(null, `uploads/${folder}/`);

    },

    //mudando o nome do arquivo da imagem
    filename: (req, file, cb) => {

        // gera um nome de arquivo único baseado no timestamp atual e na extensão do arquivo original, garantindo que cada arquivo enviado tenha um nome único no servidor.
        cb(null, Date.now() + path.extname(file.originalname));
    }

})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error("Por favor, envie apenas png ou jpg!"));
        }
        cb(undefined, true);
    },
});

module.exports = { imageUpload };