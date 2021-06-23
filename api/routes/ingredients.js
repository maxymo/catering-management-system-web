const express = require("express");

const ingredientController = require("../controllers/ingredient");
const routes = express.Router();

routes.get("", ingredientController.getIngredients);
routes.get("/:id", ingredientController.getIngredient);
routes.post("", ingredientController.createIngredient);
routes.put("/:id", ingredientController.updateIngredient);
routes.delete("/:id", ingredientController.deleteIngredient);

module.exports = routes;
