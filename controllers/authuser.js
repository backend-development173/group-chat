const User=require('../model/User');
const bcrypt = require('bcrypt');
const Message   = require('../model/chatmessage')

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

    function generateWebToken(id){
        return jwt.sign({ id: id }, 'shhhhh');
     }
     
     exports.postlogin=(req,res,next)=>{
       
        const {email,password}  = req.body;
        User.findOne({
           where:{
              email:email
           }
        }).then(result=>{
              bcrypt.compare(password, result.password).then(function(Cresult) {
                   if(Cresult==true){
                    console.log(result.dataValues);
                  
                    res.status(200).json({success:true,message:'User Log in Successful',token:generateWebToken(result.dataValues.id)})
                   }else
                   {
                      res.status(401).json({success:false,message:'User Not Authorized'})
                   }
              })      
        }).catch(err=>{
           res.status(404).json({success:false,message:'User Not Found'})
        })
     }
     

// getuser 
exports.getusers= async (req,res) =>{
    try{
  const users  = await User.findAll();
  console.log(users);
return res.status(200).json({users, success :true});
    }
    catch(err){
        console.log(err);

    }

}

//postMessage

exports.postMessage = async (req,res)=>{
    console.log(req.user + "line92")
    const msg=req.body.msg;
    console.log(msg);
    const {name}=req.user
    try{
        const message=await req.user.createMessage({
                                message:msg,
                            });
        console.log("message post",message);
         res.status(201).json({
            data:message,
            message:'message send',
            name:name
        })
    }catch(err){
         res.status(400).json({message:`msg not sent`})
    }
    
   
}