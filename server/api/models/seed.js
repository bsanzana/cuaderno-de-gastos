const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let seedSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    crop: {
      type: Schema.Types.ObjectId,
      ref: "Crop",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "CategoryProducts",
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model("Seed", seedSchema);
