//now before we creating blueprint schema for listings, same way we r building for review. 
//now reviews can be written ax to thousand times or more than it but not million for a specific listing,
//so we will use one to many second method

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

let Review = mongoose.model("Review" , reviewSchema);

module.exports = Review;