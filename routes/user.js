const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user"); 
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/user");

router.route("/signup")
.get((userController.signupformRender))
.post(wrapAsync(userController.signupForm));

router.route("/login")
//below parts mein login part has been initialised
.get(userController.loginformRender)
//below code has been copied from npm
.post(saveRedirectUrl, //saveRedirecturl has been extrated from middleware.js, iska use has been written in that file
    //basically passport will automatically authenticate, if login fails 
// it will redirect back to login page, and flash will come saying failed to login
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: true,}),
    //if upar ka pass hogya that means in below code it will mention flash saying sucessful and will rediret to listings main page
     userController.login);

//if a person wants to logout is the below code
router.get("/logout", userController.logout);

module.exports = router;
