const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
var config = require('config');
var morgan = require('morgan');
var svgCaptcha = require('svg-captcha');
var cors = require('cors');
const express = require('express'); //Load express moudule which returns a function express
const app = express(); //express fucntion retuns object of type express,by convention we call the object as app.app object support varios method get,post,put
app.use(cors());

const courses = require('./routes/courses');
const home = require('./routes/home');
const studentdetails = require('./routes/studentdetails');
const user = require('./routes/user');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`NODE_ENV: ${process.env.DEBUG}`);
//In production we set NODE_ENV=production
console.log(`app: ${app.get('env')}`);

const logger = require('./middleware/logger');

//To enable parsing of JSON object in the body of request

//http://expressjs.com/en/api.html#express.json
app.use(express.json());
//http://expressjs.com/en/api.html#express.urlencoded
app.use(express.urlencoded({ extended: true }));


//Configuration
//Note dont store password like things in it.password should be save in environment variable
//custom-environment-variables : contains only mapping of environment variable
//console.log('Application Name :' + config.get('name'));
//console.log('Mail Server :' + config.get('mail.host'));



if (app.get('env') === 'development') {

    app.use(morgan('dev'));//Not use in production
    //console.log('Morgan Enabled');
    startupDebugger('Morgan Enabled');
    //We can set debug from environment varible
    //Set Single Debug: DEBUG=app:satartup DEBUG=
    //Set Multiple : DEBUG=app:startup,app:db
    //Set Multiple : DEBUG=app:*
    //Disable : DEBUG=
    //command to run : DEBUG=app:db nodemon app.js

}
//Db logic
dbDebugger('Connected to database');
console.log('Connected to database');



/*A middleware function is basically a function that takes a request object and return the response to client or either terminates the request/response cycle or passes control to another middleware function.Ex. Route Handler Function beacuse it take req as object and return the response to client.So it terminate the request response cycle.*/
//Another ex: express.json() when we call express.json() method this method return a middleware function the job of this middleware function is to read the request and if there is json object in the body of request it will parse the body of request into a json object then it will set it req.body property.
//express.json passes the json object to route handler function.It is builtin middleware function.
//Express application is a bunch of middleware function.
//A midleware function called in sequence

//Sattic is used to serve static data. To acess locahost:5000/readme.txt
app.use(express.static('public'));  //public is name of folder
//Coustom Middlware
app.use(logger);


app.use(function (req, res, next) {
    console.log("Authenticating");
    next();
});

app.use('/', home);
app.use('/api/courses', courses);
app.use('/api/studentdetails', studentdetails);
app.use('/api/user', user);
app.get('/api/captcha', function (req, res) {
    var captcha = svgCaptcha.create({ ignoreChars: 'lI0Oo' });
    // req.session.captcha = captcha.text;
    res.json(captcha);
    // var captcha = svgCaptcha.create({ ignoreChars: 'lI' });
    // captcha.text = CryptoJS.AES.encrypt(JSON.stringify(captcha.text), 'svgcaptcha_key').toString();
    // res.json(captcha);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);

});