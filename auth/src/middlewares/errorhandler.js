const errorHandler = (err, req, res, next) => {
  console.log("Error");
  if (err.type) {
    res.status(err.statusCode).send({
      errors: {
        reasons: err.reasons, //array
      },
    });
    return
  }

  res.status(400).send({ errors: { reasons: [{ message: "Error occured" }] } });
};

module.exports = errorHandler;
