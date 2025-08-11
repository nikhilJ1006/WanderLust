// controllers/listing.js
const Listing = require("../models/listing");

// GET /listings
const index = async (req, res) => {
  const listings = await Listing.find({}).populate("owner");
  res.render("listings/index", { listings });
};

// GET /listings/new
const renderNewForm = (req, res) => {
  res.render("listings/new");
};

// GET /listings/:id
const showListings = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

// POST /listings
const createListings = async (req, res) => {
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  }
  await listing.save();
  req.flash("success", "New listing created");
  res.redirect(`/listings/${listing._id}`);
};

// GET /listings/:id/edit
const RenderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

// PUT /listings/:id
const UpdateListings = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
    await listing.save();
  }
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${listing._id}`);
};

// DELETE /listings/:id
const destroy = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};

module.exports = {
  index,
  renderNewForm,
  showListings,
  createListings,
  RenderEditForm,
  UpdateListings,
  destroy, // must match router
};
