//basially in this page, we r making schema(blueprint) model of listing lke how the places are listed database
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
     image: {
      url: String,
      filename: String,
  },
    
    price: Number,
    location: String,
    country: String,

    // below added field is for storing latitude and logitude map of each listing
    //technically lat pehle aata hai but in code while aquiring from api longitude then latitude will be intialised
   //this type of below geometry syntax is suitable for mongoose, otherwise normal syntax can also be used
    geometry: {
      type: {
        type: String, // this will always be 'Point'
        enum: ['Point'], // only allow 'Point'. mtlb point ke through map mein dikhaega location
        required: true
      },
      coordinates: {
        type: [Number], // array: [longitude, latitude], reverse hogya
        required: true
      }
    },

//now reviews can be written max to thousand times or more than it but not million for a specific listing,
//so we will use one to many relationship second method below here
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  //owner can be only one for a listing  but not million for a specific listing,
  //so we will use one to many relationship second method below here
    owner: { //owner has been created within the listing
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category:{
      type: String,
      enum: ["Trending","Rooms","Cities","Mountains","Castles","Pools","Camping","Farms","Arctic","Domes","Boats"],
    },
});

listingSchema.post("findOneAndDelete", async (listing) =>{
  if(listing){
    await Review.deleteMany({_id: { $in: listing.reviews }});
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
