const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // ✅ fixed spelling
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// Index route
router.get("/", wrapAsync(ListingController.index));

// New route
router.get("/new", isLoggedIn, ListingController.renderNewForm);

// Show route
router.get("/:id", wrapAsync(ListingController.showListings));

// Create route
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(ListingController.createListings));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.RenderEditForm));

// Update route
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(ListingController.UpdateListings));

// Delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(ListingController.destroy)); // ✅ fixed spelling

module.exports = router;
