const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({ accessToken: mapToken }); 


// Index - Show all listings
const index = async (req, res) => {
  const { category } = req.query;
  let allListings;

  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings });
 };

// New - Show form to create new listing
const renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show - Show specific listing
const showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// Create - Create new listing
// Create - Create new listing
const createListing = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
  .send();

  // ✅ FIXED: Added category to destructuring
  const { title, description, location, country, price, category } = req.body.listing;

  const listing = new Listing({
    title,
    description,
    location,
    country,
    price,
    category, // ✅ FIXED: Added category field
    owner: req.user._id,
    geometry: response.body.features[0].geometry,
  });

  // ✅ Add uploaded image info from req.file
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  let savedListing = await listing.save();
  console.log(savedListing);
  req.flash("success", "Listing created successfully!");
  res.redirect("/listings");
};

// Edit - Show form to edit listing
const renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

// Update - Update existing listing
const updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing});
  
  if(typeof req.file !== "undefined") {
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = { url, filename };
  await listing.save();
  };

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// Delete - Delete listing
const destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted successfully!");
  res.redirect("/listings");
};

// Add these functions to your controllers/listings.js file

// Search suggestions for dropdown
const searchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    // Search in title, location, and country fields
    const listings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { country: { $regex: q, $options: 'i' } }
      ]
    })
    .select('title location country price')
    .limit(8); // Limit to 8 suggestions

    res.json(listings);
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

// Full search results page
const searchListings = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.redirect('/listings');
    }

    // Search in title, location, country, and description
    const allListings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { country: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    });

    // Render the same index page but with search results
    res.render("listings/index.ejs", { 
      allListings, 
      searchQuery: q 
    });
  } catch (error) {
    console.error('Search error:', error);
    req.flash("error", "Search failed. Please try again.");
    res.redirect("/listings");
  }
};

// Add to your module.exports
module.exports = {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  destroyListing,
  searchSuggestions,  // Add this
  searchListings      // Add this
};