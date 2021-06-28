const ErrorMessageHandlerClass = require("./ErrorMessageHandlerClass");

function dispatchErrorDevelopment(error, req, res) {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
    });
  }
}
function dispatchErrorProduction(error, req, res) {
  if (req.originalUrl.startsWith("/api")) {
    if (error.isOperational) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }

    return res.status(error.statusCode).json({
      status: "Error",
      message:
        "Something went wrong Please contact support 123-999-8888 or email us at xxx@mail.com",
    });
  }
}

//Solution 1
function handleMongoDBDuplicate(err) {
  console.log(err);
  let errorMessageDuplicateKey = Object.keys(err.keyValue)[0];
  let errorMessageDuplicateValue = Object.values(err.keyValue)[0];

  // console.log(errorMessageDuplicateKey);
  // console.log(errorMessageDuplicateValue);

  //we have parse some data in here
  let message = `${errorMessageDuplicateKey} - ${errorMessageDuplicateValue} is taken please choose another one`;
  return new ErrorMessageHandlerClass(message, 400);
}
//Solution 2
// function handleMongoDBDuplicate(err) {
//   //'E11000 duplicate key error collection: backend-api.users index: email_1 dup key: { email: "hamster@mail.com" }'
//   //' email: "hamster@mail.com" '
//   //' email  hamster@gmail.com '
//   //email hamster@gmail.com
//   //[email, hamster@gmail.com]

//   let errorMessage = err.message;

//   let findOpeningBracket = errorMessage.match(/{/).index;
//   let findClosingBracket = errorMessage.match(/}/).index;

//   let foundDuplicateValueString = errorMessage.slice(
//     findOpeningBracket + 1,
//     findClosingBracket
//   );

//   let newErrorString = foundDuplicateValueString.replace(/:|\"/g, "");
//   let trimmedNewErrorString = newErrorString.trim();

//   let errorStringArray = trimmedNewErrorString.split(" ");

//   let message = `${errorStringArray[0]} - ${errorStringArray[1]} is taken please choose another one`;
//   return new ErrorMessageHandlerClass(message, 400);
// }

module.exports = (err, req, res, next) => {
  // console.log(err);
  // console.log(err.message);
  // console.log("2");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // console.log("3");
  // console.log(err);
  let error = { ...err };
  // console.log("4");

  error.message = err.message;

  // console.log("5");
  // console.log(error);
  // console.log(error.message);
  // console.log("6");
  //console.log(error);
  if (error.code === 11000 || error.code === 11001) {
    error = handleMongoDBDuplicate(error);
  }

  console.log("7");
  console.log(error);
  if (process.env.NODE_ENV === "development") {
    dispatchErrorDevelopment(error, req, res);
  } else {
    dispatchErrorProduction(error, req, res);
  }
};
