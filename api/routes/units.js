const express = require("express");

const unitController = require("../controllers/unit");
const routes = express.Router();

routes.get("", unitController.getUnits);
routes.get("/:id", unitController.getUnit);
routes.post("", unitController.createUnit);
routes.put("/:id", unitController.updateUnit);
routes.delete("/:id", unitController.deleteUnit);

module.exports = routes;
