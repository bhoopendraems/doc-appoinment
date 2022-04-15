const express=require("express");

const router=express.Router();
router.use('/usersRouter' ,require('./usersRouter'))
router.use('/adminRouter',require('./AppoinmentRouter'))
module.exports=router;

