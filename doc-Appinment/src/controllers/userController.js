const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

//---------------------user module crud opration ------------------------

module.exports.createUser = async (req, res) => {
  try {
    let { firstName,lastName,email,phone,password,dob,address } = req.body;
    
    let hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(12));
    let data = new userModel({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      dob,
      address,
    });
    let saveUserData = await data.save();
    if (saveUserData) {
      res.json({
        status: 200,
        success: true,
        message: "User Data Saved Successfully",
        data: saveUserData,
      });
    } else {
      res.json({
        status: 400,
        success: false,
        message: "Something Went Wrong",
      });
    }
  } catch (error) {
    res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    let { id } = req.query;

    let getUserData = await userModel.findOne({ _id: id });

    if (getUserData) {
      res.json({
        status: 200,
        success: true,
        message: "User Data ",
        data: getUserData,
      });
    } else {
      res.json({
        status: 400,
        success: false,
        message: "Something Went Wrong",
      });
    }
  } catch (error) {
    res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

module.exports.getAllUser = async (req, res) => {
  try {
    let getAllUserData = await userModel.find();
    if (getAllUserData.length > 0) {
      res.json({
        status: 200,
        success: true,
        message: "User Data ",
        data: getAllUserData,
      });
    } else {
      res.json({
        status: 400,
        success: false,
        message: "Something Went Wrong",
      });
    }
  } catch (error) {
    res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    let { id } = req.query;
    let { name, address, phoneNo } = req.body;

    let updateUserData = await userModel
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name: name,
            address: address,
            phoneNo: phoneNo,
          },
        }
      )
      .then((data) => {
        res.json({
          status: 200,
          success: true,
          message: "User Data Updated Successfully",
        });
      })
      .catch((error) => {
        res.json({
          status: 400,
          success: false,
          message: "Something Went Wrong",
        });
      });
  } catch (error) {
    res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    let { id } = req.query;

    let deleteUserData = await userModel
      .findOneAndDelete({ _id: id })
      .then((data) => {
        res.json({
            status: 200,
            success: true,
            message: "User Data Deleted Successfully",
          });
      })
      .catch((error) => {
        res.json({
          status: 400,
          success: false,
          message: "Something Went Wrong",
        });
      });

  } catch (error) {
    res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};
