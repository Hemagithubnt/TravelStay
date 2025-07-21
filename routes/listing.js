const express = require("express");
const router = express.Router();

// Async wrapper function
const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ✅ IMPORTANT: Search routes MUST come BEFORE parameterized routes
// Search suggestions route (for dropdown)
router.get("/search-suggestions", wrapAsync(listingController.searchSuggestions));

// Search results route (for full search)
router.get("/search", wrapAsync(listingController.searchListings));

// New Route - Show form to create new listing (also before parameterized routes)
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Index Route - Show all listings
// Create Route - Create new listing
router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn, 
    upload.single('listing[image]'), 
    validateListing, 
    wrapAsync(listingController.createListing));

// Show Route - Show specific listing
// Update Route - Update existing listing  
// Delete Route - Delete listing
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'),
 validateListing, 
 wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route - Show form to edit listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;