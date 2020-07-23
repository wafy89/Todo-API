const mongoose = require("mongoose");
const createError = require("http-errors");

const User = require("../models/User");
const { create } = require("../models/User");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const newUser = new User({ ...req.body, role: "basic" });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
};

exports.getOneUser = async (req, res, next) => {
  const { role, user } = req;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      throw new createError.NotFound();
    const userToSend = await User.findById(req.params.id);
    if (!(role == "admin") && !(userToSend.id == user.id))
      throw new createError.Unauthorized(
        "you need to be an admin to see other users"
      );
    res.status(200).send(userToSend);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  const { role, user } = req;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      throw new createError.NotFound();
    let userToUpdate = await User.findById(req.params.id);
    if (role === "admin") {
      userToUpdate = await User.findByIdAndUpdate(req.params.id, {
        ...req.body,
        /* role: "basic", */
      });
    } else if (userToUpdate.id == user.id) {
      userToUpdate = await User.findByIdAndUpdate(req.params.id, {
        ...req.body,
        role: "basic",
      });
    } else {
      throw new createError.Unauthorized(
        "you need to be an admin to update other users"
      );
    }

    if (!userToUpdate.id) throw new createError.NotFound();
    res.status(200).send(userToUpdate);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { role, user } = req;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      throw new createError.NotFound();
    if (!(role === "admin") && !(user.id == req.params.id))
      throw new createError.Unauthorized(
        "you need to be an admin to delete other users"
      );
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(204).send("User is deleted");
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const loginUser = await User.findOne({ email });
    if (!loginUser) throw new createError.Unauthorized("wrong email");
    const isCorrect = await loginUser.checkPassword(password);
    if (!isCorrect) throw new createError.Unauthorized("wrong password");

    const token = await loginUser.createToken();
    res.header("X-Auth-Token", token).status(200).send("You are logged-in");
  } catch (err) {
    next(err);
  }
};
