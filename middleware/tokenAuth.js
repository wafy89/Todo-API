const createError = require("http-errors");
const User = require("../models/User");
const Team = require("../models/Team");

const authorizeToken = async (req, res, next) => {
  const token = req.header("X-Auth-Token");
  try {
    const user = await User.findUserFromToken(token);
    if (!user) throw new createError.Unauthorized();
    let userTeams = await Team.find({ members: user._id });
    req.user = user;
    req.role = user.role || "basic";
    req.teams = userTeams;
    /* console.log(req.teams); */
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authorizeToken;
