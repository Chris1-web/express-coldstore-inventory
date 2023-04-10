const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  fileName: { type: String, required: true },
  file: { data: Buffer, contentType: String },
});

ImageSchema.virtual("url").get(function () {
  return `/image/${this._id}`;
});

module.exports = mongoose.model("Image", ImageSchema);
