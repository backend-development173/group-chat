const jwt=require('jsonwebtoken');
const User  = require('../model/User')


const auth=(req,res,next)=>{
    const token=req.header('Authorization');
    const user=jwt.verify(token,'shhhhh');
    User.findByPk(user.id).then(data=>{
        req.user=data;
        next();
    }).catch(err=>{
        res.status(401).json({success:false})
    })
}
module.exports={auth}