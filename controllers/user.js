const User = require("../models/user");

module.exports.signupformRender = (req,res)=>{
    res.render("users/signup")
};

module.exports.signupForm = async(req,res)=>{
    try{ //we could hv used wrapsync, but we r going for try&catch, this is because register is in build authenticate func. 
    // which basically means it prevents same username from being added. so when we use wrapsync it directly 
    // shouws that this username already exists u cant register, but with try catch it 
    // shows this user doesnt exist and we can render back to signup page
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to PlaceMe");
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
};

module.exports.loginformRender = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = (req,res)=>{
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";//it willeither redirect user to prev page he/she was 
    // working or normal home page if was not working before login
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
});
};