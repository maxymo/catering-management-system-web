const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const settingSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  value: { type: String, require: true },
});

settingSchema.plugin(uniqueValidator);

settingSchema.statics.initData = (Setting) => {
  console.log("Initializing Setting collection.");
  let settings = [
    {
      name: "dateFirstStart",
      value: Date.now().toString(),
      __v: 0,
    },
  ];

  Setting.deleteMany({}, (err) => {
    settings.forEach((setting) => {
      Setting.create(setting);
    });
  });
};

module.exports = mongoose.model("Setting", settingSchema);
