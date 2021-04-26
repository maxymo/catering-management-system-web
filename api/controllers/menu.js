const Menu = require("../models/menu");

exports.getMenus = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;

  try {
    const query = Menu.find();
    let fetchedMenus;

    if (pageSize && currentPage) {
      query.skip(pageSize * (currentPage - 1));
      query.limit(pageSize);
    }

    return query
      .then((documents) => {
        fetchedMenus = documents;
        return Menu.countDocuments();
      })
      .then((count) => {
        res.setHeader("content-type", "application/json");
        res.status(200).json({
          message: "Menus fetched successfully..",
          data: fetchedMenus,
          count: count,
        });
        return;
      })
      .catch((error) => {
        res.status(500).json({
          message: "Fetching menus failed.",
        });
      });
  } catch (err) {
    res.status(500).json({
      message: "Fetching menus failed.",
    });
    return err;
  }
};

exports.createMenu = (req, res, next) => {
  try {
    const menuName = req.body.name.trim();
    const menu = new Menu({
      name: menuName,
      description: req.body.description,
      portions: req.body.portions,
      ingredients: req.body.ingredients,
    });

    return menu
      .save()
      .then((createdMenu) => {
        res.status(201).json({
          message: "Menu created succesfully.",
          id: createdMenu._id,
        });
        return;
      })
      .catch((error) => {
        res.status(500).json({
          message: "Couldn't create menu",
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

exports.deleteMenu = (req, res, next) => {
  const id = req.params.id;
  Menu.deleteOne({ _id: id })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Menu deleted",
        });
      } else {
        res.status(401).json({
          message: "Not authorized!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Delete menu failed",
      });
    });
};

exports.getMenu = (req, res, next) => {
  const id = req.params.id;
  const query = Menu.findById(id);

  query.then((menu) => {
    console.log(menu);
    res.status(200).json({ data: menu });
  });
};

exports.updateMenu = (req, res, next) => {
  try {
    const menuName = req.body.name.trim();
    const menuId = req.body.id;
    const menu = new Menu({
      _id: menuId,
      name: menuName,
      description: req.body.description,
      portions: req.body.portions,
      ingredients: req.body.ingredients,
    });
    Menu.findById(menuId).then((fetchedMenu) => {
      if (!fetchedMenu) {
        res.status(400).json({
          message: `Menu with id=${menuId} does not exist.`,
        });
      } else if (fetchedMenu.readonly) {
        res.status(400).json({
          message: "Menu cannot be updated because is read only.",
        });
      } else {
        Menu.updateOne({ _id: menuId, readonly: false }, menu)
          .then((updatedMenu) => {
            res.status(201).json({
              message: "Menu updated succesfully.",
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: "Couldn't update menu",
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
