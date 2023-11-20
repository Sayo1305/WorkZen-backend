const  express = require('express')
const  bodyParser =require('body-parser')
var logger = require('morgan');
const  cors = require('cors');
const { Mongoose } = require('./db');
const userRouter = require('./routes/user');

module.exports = function(app){
    console.log('inside express use');
    app.use(express.json());
    app.use(bodyParser.json({limit:"30mb", extended:true }))
    app.use(bodyParser.urlencoded({limit:"30mb", extended:true }));
    app.use(logger('dev'));
    app.use(cors());

//     User Router
    app.use('/api/user' , userRouter);
}