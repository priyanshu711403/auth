const db = require("../config/db");

const createUserTable = () => {
   const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `;
   db.query(sql, (err) => {
      if (err) throw err;
      console.log("User table created or already exists.");
   });
};

createUserTable();

const createUser = (user, callback) => {
   const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
   db.query(sql, [user.username, user.email, user.password], callback);
};

const findUserByEmail = (email, callback) => {
   const sql = "SELECT * FROM users WHERE email = ?";
   db.query(sql, [email], callback);
};

const findUserByUsername = (username, callback) => {
   const sql = "SELECT * FROM users WHERE username = ?";
   db.query(sql, [username], callback);
};

module.exports = { createUser, findUserByEmail, findUserByUsername };
