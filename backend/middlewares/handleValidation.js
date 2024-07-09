
// Esse trecho de código lida com a validação de dados em uma aplicação Express.js utilizando o pacote express-validator. 


//Importa a função validationResult do pacote express-validator. Essa função é usada para extrair os erros de validação resultantes de uma requisição.
const { validationResult } = require("express-validator")


//Define uma função middleware chamada validate que recebe os parâmetros req, res e next, representando o objeto da requisição, o objeto de resposta e a função next para chamar o próximo middleware, respectivamente.
const validate = (req, res, next) => {

    //Verifica os erros de validação presentes no objeto de requisição req.
    const errors = validationResult(req)

    //Verifica se não há erros de validação. Se não houver erros, chama o próximo middleware.

    if (errors.isEmpty()) {
        return next();
    }
    //Inicializa um array para armazenar os erros extraídos.
    const extractedErrors = [];

    // Percorre a lista de erros de validação e extrai as mensagens de erro (err.msg) para o array extractedErrors.
    errors.array().map((err) => extractedErrors.push(err.msg));

    //Retorna uma resposta com status 422 (Unprocessable Entity) contendo um objeto JSON com a lista de mensagens de erro.
    return res.status(422).json({
        errors: extractedErrors,
    });

}
//Exporta a função validate para ser utilizada como middleware em rotas que precisam de validação de dados.
module.exports = validate