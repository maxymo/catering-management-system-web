const Shop = require("../models/shop");

exports.getShops = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;

  try {
    const query = Shop.find();
    let fetchedShops;

    if (pageSize && currentPage) {
      query.skip(pageSize * (currentPage - 1));
      query.limit(pageSize);
    }

    return query
      .then((documents) => {
        fetchedShops = documents;
        return Shop.countDocuments();
      })
      .then((count) => {
        res.setHeader("content-type", "application/json");
        res.status(200).json({
          message: "Shops fetched successfully..",
          data: fetchedShops,
          count: count,
        });
        return;
      })
      .catch((error) => {
        res.status(500).json({
          message: "Fetching shops failed.",
        });
      });
  } catch (err) {
    res.status(500).json({
      message: "Fetching shops failed.",
    });
    return err;
  }
};

exports.createShop = (req, res, next) => {
  try {
    const shopName = req.body.name.trim();
    const shop = new Shop({
      name: shopName,
      description: req.body.description,
      readonly: req.body.readonly ? req.body.readonly : false,
    });

    return shop
      .save()
      .then((createdShop) => {
        res.status(201).json({
          message: "Shop created succesfully.",
          id: createdShop._id,
        });
        return;
      })
      .catch((error) => {
        res.status(500).json({
          message: "Couldn't create shop",
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

exports.deleteShop = (req, res, next) => {
  const id = req.params.id;
  Shop.deleteOne({ _id: id })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Shop deleted",
        });
      } else {
        res.status(401).json({
          message: "Not authorized!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Delete shop failed",
      });
    });
};

exports.getShop = (req, res, next) => {
  const id = req.params.id;
  const query = Shop.findById(id);

  query.then((shop) => {
    res.status(200).json({ data: shop });
  });
};

exports.updateShop = (req, res, next) => {
  try {
    const shopName = req.body.name.trim();
    const shopId = req.body.id;
    const shop = new Shop({
      _id: shopId,
      name: shopName,
      description: req.body.description,
      type: req.body.type,
    });
    Shop.findById(shopId).then((fetchedShop) => {
      if (!fetchedShop) {
        res.status(400).json({
          message: `Shop with id=${shopId} does not exist.`,
        });
      } else if (fetchedShop.readonly) {
        res.status(400).json({
          message: "Shop cannot be updated because is read only.",
        });
      } else {
        Shop.updateOne({ _id: shopId, readonly: false }, shop)
          .then((updatedShop) => {
            res.status(201).json({
              message: "Shop updated succesfully.",
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: "Couldn't update shop",
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
