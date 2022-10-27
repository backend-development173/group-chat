const User=require('../model/User');
const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');
exports.postRegister=(req,res,next)=>{
    const {name,email,phone,password}=req.body
 

    User.findOne({where:{email:email}})
        .then(data=>{
            if(data){
               res.json({
                email:data.email,
                isSucces:false,
                message:`User already exist....!!`
            }); 
            }
            else{
                return bcrypt.hash(password, 10)
                
            }
        })
        .then(encryptedPassword=>{
            // console.log("jsddgs",encryptedPassword);
            const token=jwt.sign({email:email},process.env.JWT_SECRET_KEY);
           
            return User.create({
                name:name,
                email:email,
                phone:phone,
                password:encryptedPassword, 
                token:token
            })
           
        })
        .then(data=>{
            console.log(data);
            res.json({
                user:data,
                isSucces:true,
                message:`Successfuly signed up....!!`
            })
        })
        .catch(err=>{console.log(err);})
}

exports.postlogin = (req,res)=>{
 
    const {email,password}= req.body;
    let name;
    let token;
    let id;
    User.findOne({where: {email:email}}).then(data=>{

        if(!data) res.json({email:email, isUser:false});
        else {
             name  = data.name;
             id= data.id;
             token  = data.token;
            return bcrypt.compare(password,data.password);

        }
    }).then(isvalid=>{
         // console.log("valid",validPassword);
         if(isvalid===true){
                
            token=jwt.sign({id:id,email:email},process.env.JWT_SECRET_KEY)
           
            // console.log("token Created",token);
            res.cookie('jwt',token,{
                // expires: new Date(Date.now() + 30000),
                httpOnly:true,
                secure:true
            })

            res.json({
                name:name,
                email:email,
                auth:true,
                secretToken:token
            })
        }
        if(isvalid===false){
            res.json({
                name:name,
                email:email,
                auth:false,
                message:'User not authorized'
            
            })
        }
    })
    .catch(err=>{console.log(err);})
}