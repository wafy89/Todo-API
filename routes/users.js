const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  getOneUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/userController");
const authorizeToken = require("../middleware/tokenAuth");
const authorizeAdmin = require("../middleware/adminAuth");

router.route("/").get(authorizeToken, authorizeAdmin, getUsers);

router.route("/signup").post(addUser);

router.route("/login").post(loginUser);

router
  .route("/:id")
  .get(authorizeToken, getOneUser)
  .put(authorizeToken, updateUser)
  .delete(authorizeToken, deleteUser);

module.exports = router;
