const express = require('express')

const cors=require('cors')
const app = express()
const path=require('path');
const bodyParser = require('body-parser');
const sequelize=require('./util/database');
const userouthes = require('./routes/userauth');

const dotenv = require('dotenv');
dotenv.config();
app.use(cors());

app.use(express.static(path.join(__dirname, '/public')))
app.use(express.json());

app.use(userouthes)


sequelize.sync()
.then(res=>app.listen(4000))
.catch(err=>console.log(err))

