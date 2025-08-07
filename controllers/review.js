const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id); //Listing model se id aaegi
    let newReview = new Review(req.body.review); //newreview ke andar jo bhi new info aaegi that will be sent to Review model
    newReview.author = req.user._id;
    listing.reviews.push(newReview); //jo bhi new review create hoga voh uss particular listing ke array ke andar store hoga

    await newReview.save(); //dono ko save kardo
    await listing.save();
     req.flash("success", "New review created");
    res.redirect(`/listings/${listing._id}`); //jab sab save ho jae then redirect to that specific listing page
  };

  module.exports.deleteReview = async (req, res) => {
      let { id, reviewId } = req.params;
  
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
       req.flash("success", "New review deleted");
      res.redirect(`/listings/${id}`);
    };