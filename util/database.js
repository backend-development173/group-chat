const Sequelize=require('sequelize')

const sequelize= new Sequelize('group-chat','root','mysql1730@S',{
    dialect:'mysql',
    host:'localhost'
})



module.exports=sequelize;