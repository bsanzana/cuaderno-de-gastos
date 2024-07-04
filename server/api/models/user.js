const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

let userSchema = new Schema(
  {
    rut: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
    role: {
      type: String,
      enum: ["adviser", "admin"],
      default: "adviser",
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    address: {
      address: {
        type: String,
        required: true,
      },
      region: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      commune: {
        type: String,
        required: true,
      },
    },
    specialists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Specialist",
        required: false,
      },
    ],
    phone: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    logo: {
      type: String,
      default: null,
    },
    firma: {
      type: String,
      default: null,
    },
    password: {
      type: String,
    },
    hash: String,
    salt: String,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha1")
    .toString("hex");
};

userSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha1")
    .toString("hex");
  return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    {
      _id: this._id,
      rut: this.rut,
      email: this.email,
      name: this.name,
      role: this.role,
      active: this.active,
      phone: this.phone,
      image: this.image,
      company: this.company,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.JWT_SECRET
  );
};

mongoose.model("User", userSchema);
