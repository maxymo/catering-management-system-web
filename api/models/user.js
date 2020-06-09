const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  isAdministrator: { type: Boolean, require: true },
});

userSchema.statics.initData = (User) => {
  console.log("Initializing User collection.");
  bcrypt.hash("admin", 10).then((hash) => {
    let users = [
      {
        email: "admin@catering",
        isAdministrator: true,
        password: hash,
        __v: 0,
      },
    ];

    User.deleteMany({}, (err) => {
      users.forEach((user) => {
        User.create(user);
      });
    });
  });
};

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
