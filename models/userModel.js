const db = require("../config/db");

const User = {
  getAll: (callback) => {
    db.query("SELECT * FROM users", callback);
  },
  create: (userData, callback) => {
    db.query("INSERT INTO users SET ?", userData, callback);
  },
};

module.exports = User;
