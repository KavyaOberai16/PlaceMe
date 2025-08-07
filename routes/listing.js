const express = require("express");
const router = express.Router();//with express router we r able to create separate file for diff routes to be created 
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");//for asyncwrap error handler
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");//for authentication of new wala page

const listingController = require("../controllers/listings.js");//this folder is created so that jitna bhi different 
// routes ke humne backend functionality perform kari hain sirf vohi transfer kare, functionality not the routes

//multer has been installed from npm because we used enctype to upload images in new.ejs, multer will help these 
// files to get parsed in backend
const multer = require("multer");
const { storage } = require("../cloudconfig.js"); 
const upload = multer({ storage });


//from app.js all the routes hv been transported here

//humne below saare routes mein se listings word hata diya hain and since this word is common we 
// hv put that word in app.js so that it could be exported  from there

//this below backend operations has been forwarded to cotrollers, listing controller so that our code looks more clean,
//same thing happened with user and reviews routes as well

router.route("/")//what we did is that we did nesting of api, mtlb same start hone waleroutes ko humne combine kar diya
//ek route create kiya jisme saare listings show honge
.get(wrapAsync(listingController.index))//from controller folder in listing file
//wrapAsync mandatory toh use hoga hee in await functions so that errors could be handled well
//route for when we hv created new listing but it has to be shown on the main listings page
// check .env file for below code details
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListingPost));




//route to create new listing
//jo loggedin middleware create hua in middleware.ejs that has been used
router.get("/new", isLoggedIn, listingController.createListing);

router.route("/:id")
//show route has been created in which based on id we will get a specific listing details
.get(wrapAsync(listingController.showListing))
//ab jo edit route create kiya tha usme hum update kar kar post karenge wapis main listings par
.put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
//Delete route created
.delete(isLoggedIn, isOwner,  wrapAsync(listingController.deleteListing));


//edit route create kar rhe
//isowner is used from middleware.js file
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;
