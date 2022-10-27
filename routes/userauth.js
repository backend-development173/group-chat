const express = require('express');

const router = express.Router();

const userController=require('../controllers/authuser');


router.post('/register',userController.postRegister)
router.post('/login',userController.postlogin);


module.exports  = router;
