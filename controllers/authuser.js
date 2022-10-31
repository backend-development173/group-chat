const User=require('../model/User');
const bcrypt = require('bcrypt');
const Message   = require('../model/chatmessage')
const { Op } = require("sequelize");
const Group=require('../model/group')

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

exports.postMessage=(req,res,next)=>{
    Group.findOne({
        where:{
            name:req.body.groupName

    }}).then((response)=>{
        console.log(req.user + 'line 1000')
       return req.user.createMessage({
         messageText: req.body.chatMessage,
         name: req.user.name,
         GroupId:response.id
       });
    })
   .then(result=>{
        res.status(200).json({message:"Message added to DB",user:req.user})
    }).catch(err=>{
        console.log(err)
        res.status(404).json({message:"something went wrong"})
    })
}
//getmessage
exports.getAllmessage=(req,res,next)=>{
    let lastMessageId = req.query.lastMessageId;
    let groupName=req.query.groupName;
    Group.findOne({
        where:{
            name:groupName
        }
    }).then(data=>{
      console.log('lastMessageId',lastMessageId);
      
       return Message.findAll({
          where: {
            id: {
              [Op.gt]: lastMessageId,
            },
            GroupId:data.id
          }
        });
    })
   .then(result=>{
        res.status(200).json({message:"Fetched successfully",result})
    }).catch(err=>{
        res.status(400).json({message:"Something went wrong"})
    })
}

exports.getAllUser=(req,res,next)=>{
    User.findAll().then(result=>{
        res.status(200).json(result)
    }).catch(err=>{
        res.status(400).json({message:"Something went wrong"})
    })
 }