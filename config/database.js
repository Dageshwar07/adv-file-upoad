const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("database is connected"))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
};
