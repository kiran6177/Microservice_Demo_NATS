const jwt = require("jsonwebtoken");
const {createHash} = require('crypto')


const createToken = (user) => {
  try {
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user._id, email: user.email }, secret, {
      expiresIn: "10m",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  const verfied = jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return false;
    }
    return decoded;
  });
  return verfied;
};

const inValidate = (token) => {
  const hash = createHash("sha256");
  hash.update(token);
  return hash.digest("hex");
};

module.exports = {
  createToken,
  verifyToken,
  inValidate
};
