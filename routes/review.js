const express = require("express");
const router = express.Router({ mergeParams:true });//this was set to true because listing is parent and review is child, so
//  listing id isnot able to reach to review thats why we enabeled mergeParams as true
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const { reviewSchema } = require("../schema.js"); // only review joi needed here now
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");


//below is post review route
//humne direct post route banaya hain for review and not get route because creating alag route for reviews doesnt make sense,
//isliye har ek listing ke andar review initialise ho aisa post route create kiya
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//below is delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;