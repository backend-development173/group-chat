const express = require("express");
const router = express.Router();

const groupController=require('../controllers/group');

const authorizationMWare = require("../Middleware/authentication");

router.post('/addGroup',authorizationMWare.auth,groupController.addGroup);
router.get( "/getAllGroup", authorizationMWare.auth,groupController.getAllGroup
);
router.post("/addUserGroup", groupController.addUserGroup);
router.get("/adminChecks",authorizationMWare.auth,groupController.adminChecks);
router.post("/addAdminGroup",groupController.addAdminGroup);
router.get("/groupUser",groupController.groupUser);
router.post("/deleteUserGroup", groupController.deleteUserGroup);

module.exports=router;