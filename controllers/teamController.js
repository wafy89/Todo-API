const mongoose = require("mongoose");
const createError = require("http-errors");

const Team = require("../models/Team");

exports.getTeams = async (req, res, next) => {
  const { role, teams } = req;
  try {
    let teamsToSend;
    //only Admin an get all teams
    if (role === "admin") {
      teamsToSend = await Team.find().populate("todos", "-_id -__v");
    } else {
      //if not admin gets only the teams, that he is a member in
      teamsToSend = teams;
    }
    res.status(200).send(teamsToSend);
  } catch (err) {
    next(err);
  }
};

exports.addTeam = async (req, res, next) => {
  const { role, user } = req;
  try {
    let newTeam;
    //adding the logged-in user to the members of the team if he is not an admin
    if (role === "admin") {
      newTeam = new Team({ ...req.body });
    } else {
      newTeam = new Team({
        ...req.body,
        members: [...req.body.members, user.id],
      });
    }
    await newTeam.save();
    res.status(201).send(newTeam);
  } catch (err) {
    next(err);
  }
};

exports.getOneTeam = async (req, res, next) => {
  const { role, teams } = req;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      throw new createError.NotFound();
    const team = await Team.findById(req.params.id);
    let isTeamMember = false;
    teams.map((teamArray) => {
      if (teamArray.id == team.id) {
        isTeamMember = true;
      }
    });
    if (!(role === "admin") && !isTeamMember)
      throw new createError.Unauthorized("not admin nor member of the team");
    res.status(200).send(team);
  } catch (err) {
    next(err);
  }
};

exports.updateTeam = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      throw new createError.NotFound();
    const team = await Team.findByIdAndUpdate(req.params.id, { ...req.body });
    if (!team.id) throw new createError.NotFound();
    res.status(200).send(team);
  } catch (err) {
    next(err);
  }
};

exports.deleteTeam = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      throw new createError.NotFound();
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);
    res.status(204).send("Team is deleted");
  } catch (err) {
    next(err);
  }
};
