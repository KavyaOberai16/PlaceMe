// We created index.js to initialize the database with sample data and data.js to store that sample data, placing them in 
// the init folder to keep all database setup files organized and separate from the main application code.
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
//mongoose has been initialised
const MONGO_URL = "mongodb://127.0.0.1:27017/PlaceMe";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log("error has occured");
});

async function main(){
    await mongoose.connect(MONGO_URL);
}
//till here

const initDb = async ()=>{
    await Listing.deleteMany({});//pehle jo temp data daala tha we removed that
     const userId = new mongoose.Types.ObjectId("68862317769834cbce2211b6");//yeh id maine prompt shell se extract kari
//toh basically i defined that to userid which will define the owner
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: userId,
  }));
    await Listing.insertMany(initData.data);//after that we add new data from data.js which is our database
    console.log("data was initialized");
};

initDb();