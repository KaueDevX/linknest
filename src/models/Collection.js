const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  collectionId: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  isPrivate: {
    type: Boolean,
    default: true,
  },
  creatorId: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

CollectionSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
  },
});

module.exports = mongoose.model("Collection", CollectionSchema);
