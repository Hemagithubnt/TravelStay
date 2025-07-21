const Listing = require("../models/listing");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    // ✅ Assign author to the review
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    
    // ✅ FIXED: Use updateOne to avoid validation on the entire listing
    await Listing.updateOne(
        { _id: req.params.id },
        { $push: { reviews: newReview._id } }
    );

    req.flash("success", "New Review created successfully!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
    let {id, reviewId} = req.params;
    
    // ✅ These are already using updateOne/findByIdAndUpdate which don't trigger validation
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success", "Review Deleted successfully!");
    res.redirect(`/listings/${id}`);
};