const express = require("express");
const router = express.Router();
const {
  getTeams,
  addTeam,
  getOneTeam,
  updateTeam,
  deleteTeam,
} = require("../controllers/teamController");
const authorizeToken = require("../middleware/tokenAuth");
const authorizeAdmin = require("../middleware/adminAuth");

router.route("/").get(authorizeToken, getTeams).post(authorizeToken, addTeam);
router
  .route("/:id")
  .get(authorizeToken, getOneTeam)
  .put(authorizeToken, authorizeAdmin, updateTeam)
  .delete(authorizeToken, authorizeAdmin, deleteTeam);

module.exports = router;
