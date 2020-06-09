const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.getUsers = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const query = User.find();
  let fetchedUsers;

  if (pageSize && currentPage) {
    query.skip(pageSize * (currentPage - 1));
    query.limit(pageSize);
  }
  query
    .then((documents) => {
      fetchedUsers = documents;
      return User.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Users fetched successfully",
        data: fetchedUsers,
        count: count,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        message: "Fetching users failed.",
      });
    });
};

exports.createUser = (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const userEmail = req.body.email.trim();
      const user = new User({
        email: userEmail,
        password: hash,
        isAdministrator: req.body.isAdministrator
          ? req.body.isAdministrator
          : false,
      });

      user
        .save()
        .then((createdUser) => {
          res.status(201).json({
            message: "User created succesfully.",
            id: createdUser._id,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Couldn't create user",
          });
        });
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Some of the inputs are not valid.",
    });
  }
};

exports.deleteUser = (req, res, next) => {
  const id = req.params.id;
  User.deleteOne({ _id: id })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "User deleted",
        });
      } else {
        res.status(401).json({
          message: "Not authorized!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Delete user failed",
      });
    });
};

exports.getUser = (req, res, next) => {
  const id = req.params.id;
  const query = User.findById(id);

  query.then((user) => {
    res.status(200).json({ data: user });
  });
};

exports.updateUser = (req, res, next) => {
  try {
    const userEmail = req.body.email.trim();
    const userId = req.body.id;
    const user = new User({
      _id: userId,
      email: userEmail,
      isAdministrator: req.body.isAdministrator,
    });
    User.updateOne({ _id: userId, readonly: false }, user)
      .then((updatedUnit) => {
        res.status(201).json({
          message: "User updated succesfully.",
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Couldn't update unit",
        });
      });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Some of the inputs are not valid.",
    });
  }
};

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(401).json({ message: "Auth failed" });
    }
    fetchedUser = user;
    bcrypt
      .compare(req.body.password, user.password)
      .then((result) => {
        if (!result) {
          return res
            .status(401)
            .json({ message: "Auth failed. Password or email not valid." });
        }
        const token = jwt.sign(
          {
            email: fetchedUser.email,
            userId: fetchedUser._id,
            isAdministrator: fetchedUser.isAdministrator,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        console.log(fetchedUser);
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          isAdministrator: fetchedUser.isAdministrator,
        });
      })
      .catch((err) => {
        return res
          .status(401)
          .json({ message: "Auth failed. Exception raised." });
      });
  });
};
