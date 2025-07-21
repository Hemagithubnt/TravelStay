const express = require("express");
const router = express.Router({mergeParams: true});
// Async wrapper function
const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};
const Listing = require("../models/listing");
const Review = require("../models/review.js");

const { isLoggedIn, isReviewAuthor,validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



// Post Reviews Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// Delete Reviews Route
router.delete('/:reviewId',isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;