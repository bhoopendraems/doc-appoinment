const express = require("express");
const route = express.Router();
const Controller = require('../controllers/userController')
const controller=require('../controllers/index')
route.post("/createUser", Controller.createUser);
route.post("/")


module.exports = route;