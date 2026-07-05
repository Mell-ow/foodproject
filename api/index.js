const { app } = require("../backend/server");
const connectDB = require("../backend/src/config/db");

let dbPromise;

module.exports = async (req, res) => {
  if (!dbPromise) {
    dbPromise = connectDB();
  }

  await dbPromise;
  return app(req, res);
};
