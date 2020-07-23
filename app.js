const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const teamsRouter = require("./routes/teams");
const todosRouter = require("./routes/todos");
const { throw400, handleErrors } = require("./middleware/errors");
const mongoose = require("mongoose");
const setCORS = require("./middleware/setCORS");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/Todo-API", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection.on("open", () => console.log("MongoDB running"));
mongoose.connection.on("error", (err) => console.error(err));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(setCORS);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/todos", todosRouter);
app.use("/teams", teamsRouter);

app.use(throw400);
app.use(handleErrors);

module.exports = app;
