const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const databaseConnect = async () => {
  await mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((conn) => {
      console.log(`Db Connected to ${conn.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = databaseConnect;
