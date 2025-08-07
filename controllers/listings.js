//all the routes has been transferred here, MVC is what we call
const Listing = require("../models/listing");
const axios = require("axios"); // required to make API request

module.exports.index = async (req, res) => {
//req.query se jo humne anchor tags create kiye for each icon, we extract the category from link 
    const category = req.query.category;
    let allListings;
//agar category milli toh uski listing find karo
if (category) {
    allListings = await Listing.find({ category });
} else {//otherwise saari listings dikha do
    allListings = await Listing.find({});
}

    res.render("listings/index.ejs", { allListings });
};

module.exports.createListing = (req, res) => {    
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate:{
            path: "author",
        },
    }).populate("owner"); //populate has been used so that saare reviews dikh pae instead of their ids
    if(!listing){
     req.flash("error", "Listing does not exist");  
     res.redirect("/listings") 
    }
    console.log(listing);
      // ✅ Pass token explicitly to EJS
    res.render("listings/show.ejs", {
        listing,
        MAP_TOKEN: process.env.MAP_TOKEN//map token being rendered and used here
    });
};

module.exports.createListingPost = async (req, res, next) => {
    //check env file to gather more info about below 2 lines 
    let url = req.file.path;//we extracted url
    let filename = req.file.filename;//extracted filename

    //wrapAsyn has been used to enable error handler in this
    //jo joi humne use kiya will be applicable for all fields. it will 
    //check that the listing added is valid or not and then only the list will be added

    let { title, description, category, image, price, country, location } = req.body;

    // BELOW: Call MapTiler's geocoding API to get coordinates
//now axios ke help se hum api se data nikalenge for coordinates which will be converted to location
    const geoRes = await axios.get("https://api.maptiler.com/geocoding/" + encodeURIComponent(location) + ".json", {
        params: {
            key: process.env.MAP_TOKEN
        }
    });

    const coordinates = geoRes.data.features[0]?.geometry?.coordinates || [0, 0]; // default if nothing found
//new listing create karte hue, we need all these info
    const newListing = new Listing({
        title,
        description,
        image: { url: image, filename: "custom" },
        price,
        country,
        location,
        category,
        geometry: {
            type: "Point",
            coordinates: coordinates // this stores [lng, lat] from MapTiler
        }
    });

    newListing.owner = req.user._id;
    newListing.image = { url, filename }; //then jo url,filename extract that would be needed in aking new listing and addin image
    await newListing.save();

    req.flash("success", "New listing created"); //flash will be displayed whenever new listing will be added 
    res.redirect("/listings");
};


module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
     req.flash("error", "Listing does not exist");  
     res.redirect("/listings") 
    }
//  we want kijab user edits new image, it should be able to see old image, so we make changes edit listing route and
//  called it here , so original ko humne current image se state kara, and uske pixels humne thode kam kare because no need for high quality pic
    let originalimageUrl = listing.image.url;
    originalimageUrl = originalimageUrl.replace("/upload","/upload/w_250");//the code has been taken from cloudinary site
    res.render("listings/edit.ejs", { listing, originalimageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    
    let listing = await Listing.findById(id);

    const { title, description, category, image, price, country, location } = req.body;

    // text-based fields updated
    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.country = country;
    listing.location = location;
    listing.category = category;

    //agar file exists then url and filename will be extracted and it will be updated as new image and then new updated listing will be saved
    if(typeof req.file !== "undefined"){
        let url = req.file.path;//we extracted url
        let filename = req.file.filename;//extracted filename
        listing.image = { url, filename };
    }

    // 👇 added this part: whenever location is edited, get new coordinates via axios request
    // BELOW: Call MapTiler's geocoding API to get coordinates
    const geoRes = await axios.get("https://api.maptiler.com/geocoding/" + encodeURIComponent(location) + ".json", {
        params: {
            key: process.env.MAP_TOKEN
        }
    });

    const coordinates = geoRes.data.features[0]?.geometry?.coordinates || [0, 0]; // default if nothing found
    listing.geometry = {
        type: "Point",
        coordinates: coordinates // this stores [lng, lat] from MapTiler
    };

    await listing.save();

    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
     req.flash("success", "Listing deleted");
    res.redirect("/listings");
};