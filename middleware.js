//in this file we will combine all the middlewares that hv been used in this project, for convenience
const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema} = require("./schema.js");//joi has been imported for listing

//server side validation for listing is done and it will be used in edit and new listings routes
module.exports.validateListing = (req, res, next) => {
    //ek validateError middleware create kardiya hai which can be used in routes, to showcase error in better way possible
    let { error } = listingSchema.validate(req.body); //jo schema.js mein listing ke regarding daala hai agar usme koi error aata hai
    //toh niche wala part implement hoga
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg); //jo sabse niche humne express error initialise kiya hai
    } else {
        next();
    }
};
//server side validation for review is done and it will be used in review route
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg); //jo sabse niche humne express error initialise kiya hai
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user); //info of user is extracted
//basically in below code the user without getting logged in can view all listings, but it cannot create a new listing
//so for that we hv created authenticatio below
//this below middleware is for new wala page
if(!req.isAuthenticated()){
    //if not loged in then the page he/she was working will be saved so that after logi wapis wahi par redirect ho
        req.session.redirectUrl = req.originalUrl;//jo below redirecturl wala code hai uske related hain, taaki jis prev page mein 
        // kaam kar rha tha user after login the page where it was working that will be saved
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};
//toh basically we r trying to create a functionality in which agar user without login wants to edit or create listing but
//  obviously will not be allowed unless loggedin, so pehle voh log in karega then it will be redirected back 
// to the the page where it as trying to do the work 
module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl) {//agar koi link save hua hai from above code then that will be stored in locals so 
    // that it could be used in app.js and passport doesnt interfere with it
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;
//basically if owner does not mathces with user id then the owner will not be able to edit or update or delete other user's listing 
    let listing = await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currUser._id)){
            req.flash("error", "You are not the owner");
            res.redirect(`/listings/${id}`);
        }
        next();
};

module.exports.isReviewAuthor = async (req,res,next) => {
    let { id, reviewId  } = req.params;
//basically if owner does not mathces with user id then the owner will not be able to edit or update or delete other user's listing 
    let review = await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currUser._id)){
            req.flash("error", "You are not the author");
            return res.redirect(`/listings/${id}`);
        }
        next();
};
