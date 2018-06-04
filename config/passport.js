let LocalStrategy = require('passport-local').Strategy;

// load up the model
let User = require('../db/sqlite');

module.exports = (passport) => {
    // Configure Passport authenticated session persistence.
    //
    // In order to restore authentication state across HTTP requests, Passport needs
    // to serialize users into and deserialize users out of the session.  The
    // typical implementation of this is as simple as supplying the user ID when
    // serializing, and querying the user record by ID from the database when
    // deserializing.
    passport.serializeUser(function(user, cb) {
        cb(null, user.ID);
    });

    passport.deserializeUser(function(id, cb) {
        User.findById(id, function (err, user) {
            if (err) { return cb(err,null); }
            cb(null, user);
        });
    });
        
    // Configure the local strategy for use by Passport.
    //
    // The local strategy require a `verify` function which receives the credentials
    // (`username` and `password`) submitted by the user.  The function must verify
    // that the password is correct and then invoke `cb` with a user object, which
    // will be set at `req.user` in route handlers after authentication.
    passport.use('login',new LocalStrategy((username, password, done) => {
        User.findOne(username, password, function(err, user) {
            if (err) {return done(err);}
            done(null, user);
        });
    }));


    // Config strategy for sign up
    passport.use('signup',new LocalStrategy({
        passReqToCallback: true
      },(req,username, password, done) => {
        User.createUser({
            username: username, 
            firstname: req.body.firstname, 
            lastname: req.body.lastname, 
            password: password
        }, 
                (err, user)=> {
                    if (err) {return done(err);}
                    done(null, user);
                });
    }));
};