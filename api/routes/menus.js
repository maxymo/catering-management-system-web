const express = require("express");

const menuController = require("../controllers/menu");
const routes = express.Router();

routes.get("", menuController.getMenus);
routes.get("/:id", menuController.getMenu);
routes.post("", menuController.createMenu);
routes.put("/:id", menuController.updateMenu);
routes.delete("/:id", menuController.deleteMenu);

module.exports = routes;
