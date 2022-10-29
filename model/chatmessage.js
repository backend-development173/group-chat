const Sequelize = require('sequelize');

const sequelize = require('../util/database')

const Message = sequelize.define('message',{
    messageText:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = Message;