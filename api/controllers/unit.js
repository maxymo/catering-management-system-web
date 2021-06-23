const Unit = require("../models/unit");

exports.getUnits = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;

  try {
    const query = Unit.find();
    let fetchedUnits;

    if (pageSize && currentPage) {
      query.skip(pageSize * (currentPage - 1));
      query.limit(pageSize);
    }

    return query
      .then((documents) => {
        fetchedUnits = documents;
        return Unit.countDocuments();
      })
      .then((count) => {
        res.setHeader("content-type", "application/json");
        res.status(200).json({
          message: "Units fetched successfully..",
          data: fetchedUnits,
          count: count,
        });
        return;
      })
      .catch((error) => {
        res.status(500).json({
          message: "Fetching units failed.",
        });
      });
  } catch (err) {
    res.status(500).json({
      message: "Fetching units failed.",
    });
    return err;
  }
};

exports.createUnit = (req, res, next) => {
  try {
    const unitName = req.body.name.trim();
    const unit = new Unit({
      name: unitName,
      description: req.body.description,
      readonly: req.body.readonly ? req.body.readonly : false,
      type: req.body.type,
    });

    return unit
      .save()
      .then((createdUnit) => {
        res.status(201).json({
          message: "Unit created succesfully.",
          id: createdUnit._id,
        });
        return;
      })
      .catch((error) => {
        res.status(500).json({
          message: "Couldn't create unit",
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

exports.deleteUnit = (req, res, next) => {
  const id = req.params.id;
  Unit.deleteOne({ _id: id })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Unit deleted",
        });
      } else {
        res.status(401).json({
          message: "Not authorized!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Delete unit failed",
      });
    });
};

exports.getUnit = (req, res, next) => {
  const id = req.params.id;
  const query = Unit.findById(id);

  query.then((unit) => {
    res.status(200).json({ data: unit });
  });
};

exports.updateUnit = (req, res, next) => {
  try {
    const unitName = req.body.name.trim();
    const unitId = req.body.id;
    const unit = new Unit({
      _id: unitId,
      name: unitName,
      description: req.body.description,
      type: req.body.type,
    });
    Unit.findById(unitId).then((fetchedUnit) => {
      if (!fetchedUnit) {
        res.status(400).json({
          message: `Unit with id=${unitId} does not exist.`,
        });
      } else if (fetchedUnit.readonly) {
        res.status(400).json({
          message: "Unit cannot be updated because is read only.",
        });
      } else {
        Unit.updateOne({ _id: unitId, readonly: false }, unit)
          .then((updatedUnit) => {
            res.status(201).json({
              message: "Unit updated succesfully.",
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: "Couldn't update unit",
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
