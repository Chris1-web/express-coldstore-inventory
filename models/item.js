const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  summary: { type: String, required: true },
  numberInStock: { type: Number, required: true },
});

ItemSchema.virtual("url").get(function () {
  return `/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
