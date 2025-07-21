const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  filename: {
    type: String,
    default: "default.jpg"
  },
  url: {
    type: String,
    default: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  }
});

const listingSchema = new Schema({
  title: String,
  description: String,
  image: imageSchema,  
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],
 owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
 geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
 },
 
 category: {
  type: String,
  enum: ['Trending', 'Rooms', 'Iconic city', 'Mountain', 'Beach', 'Amazing Pools', 'Lack Front', 'River Front', 'Castles'],
  required: true
},
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

