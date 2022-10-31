const Group=require('../model/group');
const User=require('../model/User');
const User_group=require('../model/user_group');
const Message=require('../model/chatmessage')


exports.addGroup=(req,res,next)=>{
    let group;
    let groupName=req.body.groupName
    req.user.createGroup({
        name:groupName,
        createdBy:req.user.name
    }).then(result=>{
        group=result;
        console.log(result.id)
        return Message.create({
            messageText:"CREATED",
            name:req.user.name,
            GroupId:result.id
        })
    }).then(()=>{
        return User_group.update(
           { isAdmin:true},
            {where:{
                GroupId:group.id,
                UserId:req.user.id
            }}
        )
    })
    .then(result1=>{
        res.status(200).json(result1);
    }).catch(err=>{
        res.status(400).json({ message: "something went wrong" });
        console.log(err);
    })
}

exports.getAllGroup=(req,res,next)=>{
    User.findOne({
        where:{
            email:req.user.email
        }
    }).then(user=>{
       
        return user.getGroups()
    }).then(data=>{
        res.status(200).json(data)
    }).catch(err=>{
        console.log(err)
    })
}

exports.addUserGroup=(req,res,next)=>{
    let inputEmail=req.body.inputEmail;
    let groupName=req.body.groupName;
    let UserRes,GroupRes;
    console.log(req.body);
    User.findOne({
      where: {
        email: inputEmail,
      }
    }).then(user=>{
        UserRes=user;
        return Group.findOne({
            where:{
                name:groupName
            }
        })
    }).then(group=>{
        GroupRes=group;
        return User_group.create({
            UserId:UserRes.id,
            GroupId:GroupRes.id
        })
    }).then(result=>{
        res.status(200).json({message:"user added successfully"})
    }).catch(err=>{
        
        if (err.name == "SequelizeUniqueConstraintError")
          res.status(401).json({ message: "User already added" });
        else
          res.status(404).json({message:"User not present"})
    })
}

exports.adminChecks=(req,res,next)=>{
  
    req.user.getGroups()
    .then(result=>{
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err)
    })
}

exports.addAdminGroup=(req,res,next)=>{
    console.log('96')
    let userRes,groupRes;
    User.findOne({
        where:{
            email:req.body.admin
        }
    }).then(user=>{
        userRes=user;
        return Group.findOne({
            where:{
                name:req.body.groupName
            }
        })
    }).then(group=>{
        groupRes=group
        return User_group.update({
            isAdmin:true
        },
       { where:{
           UserId:userRes.id,
           GroupId:groupRes.id
       }})
    }).then(result=>{
        console.log(result)
        res.status(200).json({message:`${userRes.name} is Admin now`})
    }).catch(err=>{
        res.status(400).json({message:'something went wrong'})
    })
}

exports.groupUser=(req,res,next)=>{
    
    let groupName=req.query.groupName;
    console.log("groupName", groupName);
    Group.findOne({
        where:{
            name:groupName
        }
    }).then(group=>{
        console.log(group)
        return group.getUsers()
    }).then(data=>{
        res.status(200).json(data)
    }).catch(err=>{
        console.log(err)
    })
}

exports.deleteUserGroup=(req,res,next)=>{
  
    let user,group;
    User.findOne({
        where:{
            email:req.body.email
        }
    }).then(data=>{
        user=data;
        return Group.findOne({
            where:{
                name:req.body.groupName
            }
        })
    }).then(result=>{
        group=result;
        console.log(user.id);
        console.log(group.id)
        return User_group.destroy({
          where: {
            GroupId:group.id,
            UserId:user.id
          }
        })
    }).then(response=>{
        res.status(200).json({message:"User deleted successfully"})
    }).catch(err=>{
        console.log(err)
        res.status(400).json({message:"something went wrong"})
    })

    
}