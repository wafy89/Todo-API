const express = require("express");
const router = express.Router();
const {
  getTodos,
  addTodo,
  getOneTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");
const authorizeToken = require("../middleware/tokenAuth");
const authorizeAdmin = require("../middleware/adminAuth");

router.route("/").get(authorizeToken, getTodos).post(authorizeToken, addTodo);
router
  .route("/:id")
  .get(authorizeToken, getOneTodo)
  .put(authorizeToken, updateTodo)
  .delete(authorizeToken, deleteTodo);

module.exports = router;
