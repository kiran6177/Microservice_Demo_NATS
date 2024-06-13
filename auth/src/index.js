const express = require("express");
const app = express();
const mongoose = require("mongoose");

const currentUserRouter = require("./routes/currentuser");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const signoutRouter = require("./routes/signout");
const errorHandler = require("./middlewares/errorhandler");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(currentUserRouter);
app.use(loginRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async (req, res, next) => {
  try {
    let error = new Error();
    error.type = "NotFound";
    error.statusCode = 404;
    error.reasons = [{ message: "Not Found" }];
    throw error;
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

const connect = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-svc:27017/auth");
    console.log("auth connected");
  } catch (error) {
    console.log(error.message);
  }
};

connect();

app.listen(3001, () => {
  console.log("Auth Listening on PORT 3001!");
});
