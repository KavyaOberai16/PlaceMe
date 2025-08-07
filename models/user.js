//below is the chema for user which will be able to create its own account o the website

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");//passport will help in authentication

//the type we are using is passportlocal which already has username and passwrord inuild in it, so no need to create schema for it
//basically username,password and email ki through user will be able to use the website
const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.models.User || mongoose.model("User", userSchema);
  
module.exports = User;