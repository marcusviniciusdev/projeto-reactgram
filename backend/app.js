// O código require("dotenv").config() é usado para carregar variáveis de ambiente de um arquivo .env para o processo de Node.js. Isso é útil para configurar variáveis como credenciais de banco de dados ou chaves de API, que você não quer expor diretamente no seu código.
require("dotenv").config();


// express: Importa o módulo Express, que é um framework minimalista para criar servidores web e APIs em Node.js.
// path: Importa o módulo Path, que fornece utilitários para trabalhar com caminhos de arquivos e diretórios.
// cors: Importa o módulo CORS, que é usado para permitir que recursos sejam requisitados de um domínio diferente (Cross-Origin Resource Sharing).
const express = require("express");
const path = require("path");
const cors = require("cors");

// Define a porta em que o servidor vai escutar. Neste caso, a porta é 5000, estamos utilizando uma variavel do dotenv.
const port = process.env.PORT;

//Cria uma nova aplicação Express, que será utilizada para configurar e iniciar o servidor.
const app = express();

//config JSON and form data response
// express.json(): Middleware que analisa requisições com payload JSON e torna os dados disponíveis em req.body.
app.use(express.json())

// express.urlencoded({ extended: false }): Middleware que analisa requisições com payload codificado em URL (tipicamente de formulários HTML). O parâmetro extended: false indica que apenas objetos com strings ou arrays serão analisados.
app.use(express.urlencoded({ extended: false }))

//RESOLVENDO CORS,permitir requisições vindas de http://localhost:3000 com credenciais, somente ela pode acessar!.
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//CONEXÃO COM O BANCO DE DADOS
require("./config/db.js");

//CONFIGURANDO O DIRETÓRIO DE IMAGENS A SEREM UTILIZADAS
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//ROTAS
//chamando o arquivo routes para ser usado
const router = require("./routes/Router.js");

//conectando o arquivo de router para ser usado
app.use(router);


// app.listen(port, callback): Inicia o servidor na porta definida e executa a função de callback assim que o servidor está pronto para aceitar conexões. No callback, um console.log é usado para informar que o servidor está rodando.
app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});


//// Para rodar o nodemon (ferramenta que reinicia automaticamente o servidor a cada mudança no código do projeto),
// adicione o seguinte script na seção "scripts" do arquivo package.json:
// "server": "nodemon ./app.js"
// Depois, você pode iniciar o servidor com o comando:
// npm run server
