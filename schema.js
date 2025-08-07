//now if u remember we created form based validations in index.ejs,edit.ejs etc, those were client based validations.
//but there could be chance where incomplete data could be send on server side, so for that we use 
// joi which makes sure of validations are correct on server side

const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    //here listings whenever we create a new one is object for joi which is necessarily required
        title: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),//min value of price can be 0
        image: Joi.string().allow("",null),//image can be empty
    });

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});