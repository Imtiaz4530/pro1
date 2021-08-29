const express = require('express')
const morgan = require('morgan')
const flash = require('connect-flash')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);

const { bindUserWithRequest } = require('./authMiddleWire')
const setLocals  = require('./setLocals')

//Express-Session
var store = new MongoDBStore({
    uri: 'mongodb://localhost/MainPro1',
    collection: 'mySessions',
    expires : 60*60*1000*24
});

const middleWire = [
    morgan('dev'),
    express.urlencoded({extended:true}),
    express.json(),
    session({
        secret :process.env.SECRET_KEY || "SECRET_KEY" ,
        resave : false,
        saveUninitialized: false,
        store : store
    }),
    bindUserWithRequest(),
    setLocals(),
    flash()
]



module.exports = app => {
    middleWire.forEach(m => {
        app.use(m)
    });
}