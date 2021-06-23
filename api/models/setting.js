const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const settingSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  value: { type: String, require: true },
});

settingSchema.plugin(uniqueValidator);

settingSchema.statics.initData = async (Setting) => {
  console.log("Initializing Setting collection.");
  let settings = [
    {
      name: "dateFirstStart",
      value: Date.now().toString(),
      __v: 0,
    },
  ];

  var promises = [];
  Setting.deleteMany({}, (err) => {
    settings.forEach((setting) => {
      promises.push(Setting.create(setting));
    });
  });
  Promise.all(promises);
};

module.exports = mongoose.model("Setting", settingSchema);
