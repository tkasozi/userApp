let express = require('express');
let passport = require('passport');
const session = require('express-session'); //*

//      '/Users/tkasozi/Dropbox/school2018/test-app/db/UserDB.sqlite'


let path = require('path');
var favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');


let flush    = require('connect-flash');

let routes = require('./routes/index');
let users = require('./routes/users');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
 
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:'muchsecretinfomustkipithir', saveUninitialized:true, resave:true}));
app.use(passport.initialize());
app.use(passport.session()); //{ secret: 'keyboard cat' }
//app.use(flush);

require('./config/passport')(passport);

app.use('/', routes({option1: app, option2: passport}));
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Page Not Found Or Something Broke');
    err.status = 404;
    next(err);
});
 
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    if (res.headersSent) {
        return next(err);
    }
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
 
    // render the error page
    res.status(err.status || 500);
    res.render('error', {section: "Error Page", body: err});
});

module.exports = app;
