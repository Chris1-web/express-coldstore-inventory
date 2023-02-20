const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, "A name is required"],
    minLength: 3,
    maxLength: 100,
  },
  description: {
    type: String,
    required: [true, "A description is required"],
    minLength: 100,
  },
});

CategorySchema.virtual("url").get(function () {
  return `/store/category/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
