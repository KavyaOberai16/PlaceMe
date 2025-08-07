//this folder is for creating extra utilities that can be added
//below is the asynwrap error handler syntax which will be used in app.js
module.exports = (fn) =>{
    return (req, res, next) =>{
        fn(req, res, next).catch(next);
    };
};