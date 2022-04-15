const express = require("express");
const route = express.Router();
const Controller = require('../controllers/userController')
const controller=require('../controllers/index')

//--------------------------user crud routes ---------------------------
route.post("/createUser", Controller.createUser);

// route.get("/getUser", Controller.getUser);
// route.get("/getAllUser", Controller.getAllUser);
// route.put("/updateUser", Controller.updateUser);
// route.delete("/deleteUser", Controller.deleteUser);
module.exports=route
