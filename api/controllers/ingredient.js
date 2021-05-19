const Ingredient = require("../models/ingredient");

exports.getIngredients = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;

  try {
    const query = Ingredient.find();
    let fetchedIngredients;

    if (pageSize && currentPage) {
      query.skip(pageSize * (currentPage - 1));
      query.limit(pageSize);
    }

    return query
      .then((documents) => {
        fetchedIngredients = documents;
        return Ingredient.countDocuments();
      })
      .then((count) => {
        res.setHeader("content-type", "application/json");
        res.status(200).json({
          message: "Ingredients fetched successfully..",
          data: fetchedIngredients,
          count: count,
        });
        return;
      })
      .catch((error) => {
        res.status(500).json({
          message: "Fetching ingredients failed.",
        });
      });
  } catch (err) {
    res.status(500).json({
      message: "Fetching ingredients failed.",
    });
    return err;
  }
};

exports.createIngredient = (req, res, next) => {
  try {
    const ingredientName = req.body.name.trim();
    const ingredient = new Ingredient({
      readonly: false,
      name: ingredientName,
      description: req.body.description,
      shopName: req.body.shopName,
      defaultUnitWhenBuying: req.body.defaultUnitWhenBuying,
      defaultUnitWhenUsing: req.body.defaultUnitWhenUsing,
    });

    return ingredient
      .save()
      .then((createdIngredient) => {
        res.status(201).json({
          message: "Ingredient created succesfully.",
          id: createdIngredient._id,
        });
        return;
      })
      .catch((error) => {
        res.status(500).json({
          message: "Couldn't create ingredient",
        });
        return;
      });
  } catch (error) {
    res.status(400).json({
      message: "Some of the inputs are not valid.",
    });
    return;
  }
};

exports.deleteIngredient = (req, res, next) => {
  const id = req.params.id;
  Ingredient.deleteOne({ _id: id })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Ingredient deleted",
        });
      } else {
        res.status(401).json({
          message: "Not authorized!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Delete ingredient failed",
      });
    });
};

exports.getIngredient = (req, res, next) => {
  const id = req.params.id;
  const query = Ingredient.findById(id);

  query.then((ingredient) => {
    res.status(200).json({ data: ingredient });
  });
};

exports.updateIngredient = (req, res, next) => {
  try {
    const ingredientName = req.body.name.trim();
    const ingredientId = req.body.id;
    const ingredient = new Ingredient({
      _id: ingredientId,
      readonly: false,
      name: ingredientName,
      description: req.body.description,
      shopName: req.body.shopName,
      defaultUnitWhenBuying: req.body.defaultUnitWhenBuying,
      defaultUnitWhenUsing: req.body.defaultUnitWhenUsing,
    });
    Ingredient.findById(ingredientId).then((fetchedIngredient) => {
      if (!fetchedIngredient) {
        res.status(400).json({
          message: `Ingredient with id=${ingredientId} does not exist.`,
        });
      } else if (fetchedIngredient.readonly) {
        res.status(400).json({
          message: "Ingredient cannot be updated because is read only.",
        });
      } else {
        Ingredient.updateOne({ _id: ingredientId, readonly: false }, ingredient)
          .then((updatedIngredient) => {
            res.status(201).json({
              message: "Ingredient updated succesfully.",
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: "Couldn't update ingredient",
            });
          });
      }
    });
  } catch (error) {
    res.status(400).json({
      message: "Some of the inputs are not valid.",
    });
  }
};
