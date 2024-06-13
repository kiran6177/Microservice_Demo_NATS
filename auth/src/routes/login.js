const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/userModel");
const { verifyToken, createToken } = require("../utils/jwt");
const { compare } = require("../utils/hash");
const router = express.Router();

router.post(
  "/api/users/login",
  [
    body("email").isEmail().withMessage("Email must be valid!!"),
    body("password").trim().notEmpty().withMessage("Enter valid password!!"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let error = new Error();
        error.type = "RequestValidation";
        error.statusCode = 400;
        error.reasons = errors.array().map((error) => {
          return { message: error.msg, field: error.path };
        });
        throw error;
      }
      const { email, password } = req.body;
      const userFind = await User.findOne({ email });
      if (userFind) {
        let pwd = await compare(userFind.password, password);
        if (pwd) {
          const userToken = createToken(userFind);
          console.log("userToken", userToken);
          res.send({
            user: { id: userFind._id, email: userFind.email },
            userToken,
          });
        } else {
          const error = new Error();
          error.type = "BadRequest";
          error.statusCode = 400;
          error.reasons = [{ message: "Invalid Password!" }];
          throw error;
        }
      } else {
        const error = new Error();
        error.type = "BadRequest";
        error.statusCode = 400;
        error.reasons = [{ message: "Invalid Credentials!" }];
        throw error;
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
);

module.exports = router;
