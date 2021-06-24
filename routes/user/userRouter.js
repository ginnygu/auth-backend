const express = require("express");
const router = express.Router();

const { signup, login } = require("./controller/userController");

const checkIsUndefined = require("./helpers/checkIsUndefined");
const checkIsEmptyFunc = require("./helpers/checkIsEmptyFunc");
const checkIsStrongPasswordFunc = require("./helpers/checkIsStrongPasswordFunc");

const {
  checkIsEmailFunc,
  checkIsAlphaFunc,
  checkIsAlphanumericFunc,
} = require("./helpers/authMiddleware");

router.post(
  "/sign-up",
  checkIsUndefined,
  checkIsEmptyFunc,
  checkIsStrongPasswordFunc,
  checkIsEmailFunc,
  checkIsAlphaFunc,
  checkIsAlphanumericFunc,
  signup
);

router.post(
  "/login",
  checkIsUndefined,
  checkIsEmptyFunc,
  checkIsEmailFunc,
  login
);

module.exports = router;
