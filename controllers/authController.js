const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { createUser, findUserByEmail, findUserByUsername } = require("../models/userModel");

const register = async (req, res) => {
   const { username, email, password } = req.body;

   try {
      const user = await new Promise((resolve, reject) =>
         findUserByEmail(email, (err, results) => (err ? reject(err) : resolve(results)))
      );

      if (user.length) {
         return res.status(400).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { username, email, password: hashedPassword };

      await new Promise((resolve, reject) => createUser(newUser, (err, result) => (err ? reject(err) : resolve(result))));

      res.status(201).json({ message: "User registered successfully" });
   } catch (error) {
      res.status(500).json({ message: "Server error" });
   }
};

const login = async (req, res) => {
   const { email, password } = req.body;

   try {
      const user = await new Promise((resolve, reject) =>
         findUserByEmail(email, (err, results) => (err ? reject(err) : resolve(results)))
      );

      if (!user.length || !(await bcrypt.compare(password, user[0].password))) {
         return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user[0].id }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ token });
   } catch (error) {
      res.status(500).json({ message: "Server error" });
   }
};

module.exports = { register, login };
