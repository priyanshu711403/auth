const { findUserByUsername } = require("../models/userModel");

const getProfile = async (req, res) => {
   try {
      const user = await new Promise((resolve, reject) =>
         findUserByUsername(req.userId, (err, results) => (err ? reject(err) : resolve(results)))
      );

      if (!user.length) return res.status(404).json({ message: "User not found" });

      const { id, username, email } = user[0];
      res.status(200).json({ id, username, email });
   } catch (error) {
      res.status(500).json({ message: "Server error" });
   }
};

module.exports = { getProfile };
