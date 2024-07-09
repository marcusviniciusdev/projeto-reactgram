const express = require("express");
const router = express();

//conctando o arquivo UserRouter com as rotas separadas do usuário, objetivo é trazer otimização de manutenibilidade de código
// "/api/users" é a rota base para todas as operações relacionadas aos usuários.
// "/api/photos" é a rota base para todas as operações relacionadas às fotos.
router.use("/api/users", require("./UserRoutes"));
router.use("/api/photos", require("./PhotoRoutes"))



module.exports = router;