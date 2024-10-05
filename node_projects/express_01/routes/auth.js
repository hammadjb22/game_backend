const express=require('express');
 const router=express.Router();
 exports.router=router
const authController=require('../controller/auth')

router.post('/signupUser',authController.createUser)
router.post('/signinUser',authController.login)
