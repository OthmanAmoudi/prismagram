const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SALT_I = 10;

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "invalid email"],
  },

  password: {
    type: String,
    required: true,
    minLength: 5,
    // select: false,
  },

  name: {
    type: String,
    maxLength: 100,
  },
  lastname: {
    type: String,
    maxLength: 100,
  },
  token: String,
});

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(SALT_I, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (error, hash) {
        if (error) return next(error);
        user.password = hash;
        next();
      });
    });
  }
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt
    .compare(candidatePassword, this.password)
    .then(function (result) {
      return result;
    });
};

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  user.token = token;
  return user.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
