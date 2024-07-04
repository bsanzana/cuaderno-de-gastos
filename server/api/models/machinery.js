const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let machinerySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    labor: {
      type: Schema.Types.ObjectId,
      ref: "Work",
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model("Machinery", machinerySchema);
