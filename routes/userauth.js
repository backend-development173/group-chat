const express = require('express');

const router = express.Router();

const userController=require('../controllers/register');


router.post('/register',userController.postRegister)


module.exports  = router;