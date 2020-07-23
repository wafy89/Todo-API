const mongoose = require("mongoose");
const createError = require("http-errors");

const Todo = require("../models/Todo");
const Team = require("../models/Team");
const User = require("../models/User");

exports.getTodos = async (req, res, next) => {
  const { teams, role } = req;

  try {
    let todos;
    if (role === "admin") {
      todos = await Todo.find();
    } else {
      todos = await Todo.find({ team: teams });
    }
    res.status(200).send(todos);
  } catch (err) {
    next(err);
  }
};

exports.addTodo = async (req, res, next) => {
  try {
    const newTodo = new Todo({ ...req.body, author: req.user._id });
    await newTodo.save();
    res.status(201).send(newTodo);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getOneTodo = async (req, res, next) => {
  const { teams, role, user } = req;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      throw new createError.NotFound();
    const todo = await Todo.findById(req.params.id);
    let isTeamMember = false;
    teams.map((team) => {
      if (team.id == todo.team) {
        isTeamMember = true;
      }
    });
    if (!(role === "admin") && !isTeamMember)
      throw new createError.Unauthorized();
    res.status(200).send(todo);
  } catch (err) {
    next(err);
  }
};

exports.updateTodo = async (req, res, next) => {
  const { role, user } = req;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      throw new createError.NotFound();
    const todo = await Todo.findByIdAndUpdate(req.params.id, { ...req.body });
    if (!todo.id) throw new createError.NotFound();
    if (!(role === "admin") && !(user.id == todo.author))
      throw new createError.Unauthorized("is not an admin nor an author");
    res.status(200).send(todo);
  } catch (err) {
    next(err);
  }
};

exports.deleteTodo = async (req, res, next) => {
  const { role, user } = req;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      throw new createError.NotFound();
    const todo = await Todo.findById(req.params.id);
    if (!(role === "admin") && !(user.id == todo.author))
      throw new createError.Unauthorized("is not an admin nor an author");

    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
