const express = require('express');

const router = express.Router();

const userController=require('../controllers/authuser');
const Authentication   = require('../Middleware/authentication')

router.post('/register',userController.postRegister)
router.post('/login',userController.postlogin);
router.get('/users',Authentication.auth,userController.getusers);

router.post('/sendMessage',Authentication.auth, userController.postMessage)
router.get('/getAllmessage',Authentication.auth,userController.getAllmessage);
router.get("/getAllUser",userController.getAllUser);

module.exports  = router;
