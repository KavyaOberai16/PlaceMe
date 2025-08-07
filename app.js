if(process.env.NODE_ENV != "production"){ 
  //2 pphases hote hain 1 is development and other is production
  //we hv downloaded dotenv from npm so that env file could connect with backend, so bascally above code states that
  // if not i production we can access env file
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require(`connect-mongo`); //npm i connect-mongo has been installed
const flash = require("connect-flash");
const passport = require("passport");//passport and its local, below has been require
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");//user schema has beem aquired


// reminder that we created lsiting and review all rutes in this file, but for better code management we created 
// a folder called routes in which separate file for lisitngs and reviews are created and their routes are embedded in them,this whole 
// process is called express router

//listing route imported from routes folder,
const listingRouter = require("./routes/listing.js"); //listing word was common among all routes so we brought that common word here
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//for views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//for public folder we hv created this below
app.use(express.static(path.join(__dirname, "/public")));

//below code is for parsing of js from express
app.use(express.urlencoded({ extended: true }));

//for put and delete operation we hv to download this
app.use(methodOverride("_method"));

//below we downloaded ejs-mate so we required this below, also ejs-mate is used to write code that is common in all other
//layouts and we dont hv to write again and again
app.engine("ejs", ejsMate);

//below is basic mongoose connection, make sure to run mongosh in prompt shell as well
// const MONGO_URL = "mongodb://127.0.0.1:27017/PlaceMe";

const dbUrl = process.env.ATLASDB_URL;//we r basically acquiring the link from env which was aquired from mongdb
//npm i connect-mongo has also been installed

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("error has occurred");
  });

async function main() {
  await mongoose.connect(dbUrl); //mongodb se connect hogya so that we could host our website 
}//till here

//meaning when we connected mongo atlas to our project
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,//mtlb after 24 hours, login/signup wala jo data hain voh hat jaega from session, toh after 24 we will hv login again
});
store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

//below is express sessions is being connected, go to inspect, click applications, check under cookies that sessio is connected or not
const sessionOptions = {
    secret: process.env.SECRET,
    resave: false, //dont save anything, if no change happens, this way it saves time
    saveUninitialized: true, //can save even empty sessions
    //if we go npm, we can see which type of cookies can be used, below is expired cookie which can store data upto mentioned time limit
    cookie: {
        //below it say sit will expire in 7 days, 24 hours, 60 min, 60 sec, 1000 millisecond
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};


//use below these 2 before routes, so that it could be applied
app.use(session(sessionOptions));
app.use(flash()); //without sessions flash cannot be used
//express app ko basically bataya hain ki hum passport use karne wale hain for user's authentication
app.use(passport.initialize());//passport ko initialize kardiya
app.use(passport.session());//without passport session cannot be used, because when a user visites it goes to multiple 
// pages so to keep track of the user info we hv to use passport within session
//middleware for flash
app.use((req,res,next) =>{
    res.locals.success = req.flash("success");//from route listing.js we local will catch the flash 
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //user ki info extracted
    next();
});

passport.use(new LocalStrategy(User.authenticate()));//user ki info aaegi that will passed through localstrategy which makes 
// sure that the user's info remain authenticate
passport.serializeUser(User.serializeUser());//jab user aata hain on website its info is serialized
passport.deserializeUser(User.deserializeUser());//when user leaves the website, its info is not being used so deserialized
//till here

//route for home page
// app.get("/", (req, res) => {
//   res.send("Hi, I m root");
// });


//✅ All listing routes moved to listingRouter
app.use("/listings", listingRouter);//listings was common among links of routes
app.use("/listings/:id/reviews", reviewRouter);//this whole link was common among all review routes
app.use("/", userRouter);


//error handler route if no path matches
app.all("*", (req, res, next) => {
  // * means applicable to all routes, jo error handler ka code just iske below daala hai
  next(new ExpressError(404, "Page not found"));
});

//used the below error handler code in routes
//abstracted from expresserror.js file
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

//down we r just checking that port is working
app.listen(8080, () => {
  console.log("the server is working at port ");
});
