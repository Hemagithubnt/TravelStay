const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};
const { saveRedirectUrl } = require("../middleware.js"); // ✅ CORRECT
const userController = require("../controllers/users.js");
 
// router for given the signup form
 // router for handling the signup form submission
router.route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));
   
  //login router for taking form of login 
  // Login router to submit the login form for checking that user is authenticated or not
  router.route("/login")
  .get(userController.renderLoginForm)
  .post(
  saveRedirectUrl, 
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),userController.login);
    
// Logout router
router.get("/logout",
  userController.logout
);
    

module.exports = router;