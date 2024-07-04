const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: false,
    },
    rut: {
      type: String,
      required: true,
      unique: true,
    },
    birth_date: { type: Date },
    gender: {
      type: String,
    },
    activities_sii: {
      type: Boolean,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "CompanyGroup",
    },
    fields: [
      {
        name: {
          type: String,
          required: true,
        },
        sector: {
          type: String,
          required: true,
        },
        rol: {
          type: String,
        },
        address: {
          type: String,
        },
        ha: {
          type: Number,
          required: true,
        },
      },
    ],
    machinery: [
      {
        name: {
          type: String,
          required: true,
        },
        brand: {
          type: String,
        },
        hp: {
          type: Number,
        },
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      default: '123',
    },
  },
  {
    timestamps: true,
  }
);


mongoose.model("Company", companySchema);