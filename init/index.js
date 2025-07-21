const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// ✅ Replace with your actual Mapbox token
const mapToken = 'YOUR_MAPBOX_TOKEN_HERE';
const geocoder = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = "mongodb://127.0.0.1:27017/TravelStay";

main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  
  for (let obj of initData.data) {
    // Fetch real geometry from location string
    const geoData = await geocoder.forwardGeocode({
      query: obj.location,
      limit: 1
    }).send();

    const listing = new Listing({
      ...obj,
      owner: "687a3ada430abf04bdc2cfa6",
      geometry: geoData.body.features[0].geometry // 🔥 auto-populate live location
    });

    await listing.save();
  }

  console.log("✅ All listings initialized with live coordinates");
};

initDB();
