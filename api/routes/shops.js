const express = require("express");

const shopController = require("../controllers/shop");
const routes = express.Router();

routes.get("", shopController.getShops);
routes.get("/:id", shopController.getShop);
routes.post("", shopController.createShop);
routes.put("/:id", shopController.updateShop);
routes.delete("/:id", shopController.deleteShop);

module.exports = routes;
