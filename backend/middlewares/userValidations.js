const { body } = require("express-validator");


//A função userCreateValidation retorna um array com uma única validação. Essa validação usa o método body("name") para especificar que a validação deve ser aplicada ao campo "name" do corpo da requisição. Em seguida, é encadeado o método isString().withMessage("O nome é obrigatório."), que valida se o campo é uma string e define a mensagem de erro a ser exibida caso a validação falhe.

const userCreateValidation = () => {
    return [

        body("name")
            .isString()
            .withMessage("O nome é obrigatório.")
            .isLength({ min: 3 })
            .withMessage("O nome precisa ter no mínimo 3 caracteres."),

        body("email")
            .isString()
            .withMessage("O e-mail é obrigatório.")
            .isEmail()
            .withMessage("Insira um e-mail válido"),

        body("password")
            .isString()
            .withMessage("A senha é obrigatória.")
            .isLength({ min: 5 })
            .withMessage("A senha precisa de no mínimo 5 caracteres."),

        body("confirmPassword")
            .isString()
            .withMessage("A confirmação de senha é obrigatória.")
            .custom((value, { req }) => {
                if (value != req.body.password) {
                    throw new Error("As senhas não são iguais.");
                }
                return true;
            }),

    ];


};

const loginValidation = () => {

    return [
        body("email")
            .isString()
            .withMessage("O e-mail é obrigatório.")
            .isEmail()
            .withMessage("Insira um e-mail válido"),

        body("password").isString().withMessage("A senha é obrigatória."),
    ];

}

const userUpdateValidation = () => {
    return [
        body("name")
            .optional()
            .isLength({ min: 3 })
            .withMessage("O nome precisa ter no mínimo 3 caracteres."),
        body("password")
            .optional()
            .isLength({ min: 5 })
            .withMessage("A senha precisa de no mínimo 5 caracteres."),
    ];
};



module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation
}