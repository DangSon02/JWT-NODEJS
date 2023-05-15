const { generateToken } = require("../config/jwtToken");
const { generateReFreshToken } = require("../config/refreshToken");
const { use } = require("../routers/authRoute");
const { validateMongoDbId } = require("../utils/validateMongodbld");
const User = require("./../models/userModels");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

//Tao User

exports.createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  // neu khong co cai email thi tao use
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});
//user  dang nhap
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  //check user va mat khau
  if (findUser && (await findUser.correctPassWord(password))) {
    const refreshToken = await generateReFreshToken(findUser.id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser.id,
      firstname: findUser.firstname,
      lastname: findUser.lastname,
      email: findUser.email,
      mobile: findUser.mobile,
      token: generateToken(findUser.id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});
// lay ra tat ca user
exports.getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});
//lay ra mot user
exports.getaUser = asyncHandler(async (req, res) => {
  validateMongoDbId(req.params.id);
  try {
    const findaUser = await User.findById(req.params.id);
    res.json({ findaUser });
  } catch (error) {
    throw new Error(error);
  }
});
// xử lý mã thông báo mới
exports.handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    throw new Error("No Fresh Token in Cookie");
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new Error("No Refresh Token present in db or not matched");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refrsh toekn");
    }
    const accessToken = generateToken(user.id);
    res.json({ accessToken });
  });
});

// xử lý đăng xuất
exports.logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    throw new Error("No Refresh Token in Cookie");
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // mã 204 yêu cầu xử lý thành công và không có dữ liệu tải về
  }
  const userLogIn = await User.findOneAndUpdate({ refreshToken });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204); //mã 204 yêu cầu xử lý thành công và không có dữ liệu tải về
});

//update mot user
exports.updateaUser = asyncHandler(async (req, res) => {
  validateMongoDbId(req.params.id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

//xoa mot user
exports.deleteUser = asyncHandler(async (req, res) => {
  validateMongoDbId(req.params.id);
  try {
    const deteletaUser = await User.findByIdAndDelete(req.params.id);
    res.json({ deteletaUser });
  } catch (error) {
    throw new Error(error);
  }
});

exports.blockUser = asyncHandler(async (req, res) => {
  validateMongoDbId(req.params.id);
  try {
    const block = await User.findByIdAndUpdate(
      req.params.id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User Blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

exports.unblockUser = asyncHandler(async (req, res) => {
  validateMongoDbId(req.params.id);
  try {
    const block = await User.findByIdAndUpdate(
      req.params.id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User Unblocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});
