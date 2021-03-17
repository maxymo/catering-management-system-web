const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const unitRoutes = require("./routes/units");
const shopRoutes = require("./routes/shops");
const ingredientRoutes = require("./routes/ingredients");
const userRoutes = require("./routes/user");

const User = require("./models/user");
const Unit = require("./models/unit");
const Shop = require("./models/shop");
const Ingredient = require("./models/ingredient");
const Setting = require("./models/setting");
const app = express();

console.log("Connecting to " + process.env.MONGO_ATLAS_CONNECTION_STRING);
mongoose
  .connect(process.env.MONGO_ATLAS_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("Connected to database!");
    Setting.findOne({ name: "dateFirstStart" }).then((result) => {
      if (!result) {
        console.log("Initializing database");
        User.initData(User).then((_) => {
          Unit.initData(Unit).then((_) => {
            Shop.initData(Shop).then((_) => {
              Ingredient.initData(Ingredient).then((_) => {
                Setting.initData(Setting).then((_) => {
                  app.emit("databaseReady");
                });
              });
            });
          });
        });
      }
    });
    return;
  })
  .catch(() => {
    console.log("Contection failed");
  });

function disconnectDatabase() {
  console.log("Disconnecting database");
  mongoose.disconnect();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/units", unitRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/ingredients", ingredientRoutes);

module.exports = app;
module.exports.disconnectDatabase = disconnectDatabase;
