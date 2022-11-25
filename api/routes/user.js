const express = require("express");

const userController = require("../controllers/user");
const routes = express.Router();

routes.get("", userController.getUsers);
routes.get("/:id", userController.getUser);
routes.post("", userController.createUser);
routes.put("/:id", userController.updateUser);
routes.post("/:id", userController.loginUser);
routes.delete("/:id", userController.deleteUser);

module.exports = routes;
