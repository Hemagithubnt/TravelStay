const joi = require("joi");

module.exports.listingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    country: joi.string().required(),
    location: joi.string().required(),
    price: joi.number().required().min(0),
    category: joi.string().required(), // ✅ Added category field
    image: joi.object({
      url: joi.string().uri().allow("", null).default("https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=800&q=60"),
      filename: joi.string().allow("", null).default("default.jpg"),
    }).default(), // allow image to be optional
  }).required(),
});

module.exports.reviewSchema = joi.object({
  review: joi.object({
    rating: joi.number().required().min(1).max(5),
    comment: joi.string().required()
  }).required(),
});
