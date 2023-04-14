const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // this only works on .create() and .save()
      validator: function (el) {
        // el here is user's input value
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

// Encrypting user's password before saving it to database
userSchema.pre('save', async function (next) {
  // only run this function pass word is actually modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12); // 12 here is cost value, higher value makes it more cpu intensive

  this.passwordConfirm = undefined; // delete a passwordConfirm field or field won't be persisted to the database
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
