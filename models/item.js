const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  name: { type: String, required: true },
  Price: { type: Number, required: true },
  Summary: { type: String, required: true },
  NumberInStock: Number,
});

ItemSchema.virtual("url").get(function () {
  return `/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
