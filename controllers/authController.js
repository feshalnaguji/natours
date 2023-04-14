const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel.js');
const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError.js');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// create a new user
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // creating JWT
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token, // sending jwt
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email or password', 400));
  }

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password'); // explicitly selecting password as it's select property is false

  if (!user || !(await user.correctPassword(password, user.password))) {
    return new AppError('Incorrect email or password', 401);
  }

  // 3) If everything is ok, sent token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

// Implementing protected routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1) get the token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access.', 401)
    );
  }
  // 2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // promisifying function and it will return decoded payload

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to token no longer exist', 401)
    );
  }

  // 4) if user changed password after the JWT is issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});
