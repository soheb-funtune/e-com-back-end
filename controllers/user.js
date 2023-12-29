const USER = require("../models/ShopperRegister");
const CART = require("../models/CartItems");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//=======================createUser====================

exports.createUser = async function (req, res, next) {
  try {
    // console.log(req.file);
    if (!req.body.username || !req.body.email || !req.body.password) {
      throw new Error("Please Enter Valid Field");
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
    // console.log(req.body);
    const data = await USER.create(req.body);
    res.status(201).json({
      data: { status: "Successful", message: "User SucessFully Added", data },
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

//=======================login====================

exports.loginUser = async function (req, res, next) {
  console.log("reqBody", req.body);
  try {
    const checkUser = await USER.findOne({ email: req.body.email });

    if (!checkUser) {
      throw new Error("User not found");
    }
    console.log("req?.body:", req?.body);
    const checkPass = await bcrypt.compare(
      req.body.password,
      checkUser.password,
      (err, result) => {
        if (err) {
          throw new Error(err || "Password is Wrong");
        }
      }
    );

    var token = jwt.sign(
      { id: checkUser._id },
      process.env.JwtSign ||
        `my-32-character-ultra-secure-and-ultra-long-secret`
    );

    res.status(200).json({
      data: {
        status: "Successful",
        message: "Login SucessFully",
        _id: checkUser?._id,
        token,
        email: checkUser?.email,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
//======================= cart items ====================

exports.getUserCartItems = async function (req, res, next) {
  console.log("getUserCartItems");
  try {
    const { user_id } = req.query;
    const userCartItems = await CART.find({ user_id: user_id });

    if (!userCartItems) {
      // throw new Error("User not found");
      res.status(404).json({
        status: "not found",
        message: " User not found",
      });
    }

    res.status(200).json({
      data: {
        status: "Successful",
        message: " SucessFully",
        data: userCartItems,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.userAddCartItems = async function (req, res, next) {
  try {
    const { _id, ...rest } = req?.body;
    // console.log({ product_id });
    const { user_id } = req.query;
    let userCartItems = await CART.create({
      user_id: user_id,
      // product_id: product_id,
      // sizes: sizes,
      ...rest,
      quantity: 1,
    });
    userCartItems = await userCartItems.save();

    if (!userCartItems) {
      // throw new Error("User not found");
      res.status(404).json({
        status: "not found",
        message: " User not found",
      });
    }

    res.status(200).json({
      status: "Successful",
      message: " SucessFully",
      data: userCartItems,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
exports.userRemoveCartItems = async function (req, res, next) {
  try {
    console.log(req.body);
    const { user_id } = req.query;
    let oneDoc = await CART.find({
      user_id: user_id,
    });
    oneDoc = oneDoc?.find((item) => item?.product_id == req?.body?.product_id);
    console.log({ oneDoc });
    const userCartItems = await CART.findOneAndDelete(oneDoc?._id);

    res.status(200).json({
      data: {
        status: "Successful",
        message: " SucessFully Deleted",
        data: userCartItems,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
exports.userUpdateCartItems = async function (req, res, next) {
  try {
    const { user_id } = req.query;
    const { product_id, quantity } = req?.body;

    let oneDoc = await CART.find({
      user_id: user_id,
    });
    console.log({ oneDoc });
    oneDoc = oneDoc?.find((item) => item?.product_id == product_id);
    const userCartItems = await CART.findByIdAndUpdate(
      oneDoc?._id,
      { $set: { quantity: quantity } },
      { new: true }
    );

    res.status(200).json({
      status: "Successful",
      message: " SucessFully Updated",
      data: userCartItems,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
