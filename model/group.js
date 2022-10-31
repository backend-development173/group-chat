const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const group=sequelize.define('Group',{
    name:{
        type:Sequelize.STRING,
        unique:true
    },
    createdBy:{
        type:Sequelize.STRING
    }
})

module.exports=group;