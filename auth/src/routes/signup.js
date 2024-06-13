const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/userModel");
const { hash } = require("../utils/hash");
const { createToken } = require("../utils/jwt");

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid!!"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Passowrd invalid!!"),
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
      console.log("Creating User...");
      const userExist = await User.findOne({ email });
      if (userExist) {
        console.log("Account exists!!");
        const error = new Error("Account Exist");
        error.type = "BadRequest";
        error.statusCode = 400;
        error.reasons = [{ message: "Account already exists !!" }];
        throw error;
      } else {
        const hashed = await hash(password);
        console.log(hashed);
        const userCreate = await User.create({ email, password: hashed });
        if (userCreate) {
          const userToken = createToken(userCreate);
          console.log("userToken", userToken);
          res.send({
            user: { id: userCreate._id, email: userCreate.email },
            userToken,
          });
        }
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
