const express = require("express");
const router = express.Router();

//controller
//Desestruturação dos objetos exportados que carregam as Funções do controller
const { register, login, getCurrentUser,update, getUserById } = require("../controllers/UserController")



//Middlewares
const validate = require("../middlewares/handleValidation")
const { userCreateValidation, loginValidation, userUpdateValidation } = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");

//Rotas
// O middleware validate é colocado no meio da definição da rota router.post("/register", validate, register) porque ele é responsável por validar os dados recebidos na requisição antes de passar o controle para a função register, que efetivamente processará o registro do usuário. Se houver erros de validação, o middleware validate responde com um status de erro e não permite que a função register seja executada.
router.post("/register", userCreateValidation(), validate, register);

router.post("/login", loginValidation(), validate, login);

router.get("/profile", authGuard, getCurrentUser);

router.put("/", authGuard, userUpdateValidation(), validate, imageUpload.single("profileImage"),update);

router.get("/:id", getUserById);

//exportando essas rotas
module.exports = router;