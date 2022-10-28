const express = require('express')

const cors=require('cors')
const app = express()
const path=require('path');
const bodyParser = require('body-parser');
const sequelize=require('./util/database');
const userouthes = require('./routes/userauth');
const User  = require('./model/User');
const message  = require('./model/chatmessage');


const dotenv = require('dotenv');
dotenv.config();
app.use(cors());

app.use(express.static(path.join(__dirname, '/public')))
app.use(express.json());

app.use(userouthes)
User.hasMany(message);
message.belongsTo(User);


sequelize.sync()
.then(res=>app.listen(4000))
.catch(err=>console.log(err))

