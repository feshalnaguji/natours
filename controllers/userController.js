const User = require('./../models/userModel.js');
const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError.js');
const factory = require('./handlerFactory.js');

// filtering update current data object
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// Route handlers for routes
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create error if user POSTs a password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please user /updateMyPassword',
        400
      )
    );
  }

  // 2) Filtered out unwanted filed names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // user.name = 'ffffff';
  // await user.save();

  res.status(200).send({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// deleting user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use /signup instead',
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// DO NOT update password with this
exports.updateUser = factory.updateOne(User); // Only for administrators to update user data
exports.deleteUser = factory.deleteOne(User); // Only for administrators to delete user completely
