let auth = require('connect-ensure-login');

module.exports = (options) =>{      
    let app = options.option1;
    let passport = options.option2;
    
    app.get('/', auth.ensureLoggedOut('/profile'), (req, res)=>{
        res.render('index',{title: "Welcome"});
    })

    app.get('/login', auth.ensureLoggedOut('/profile'),(req, res)=>{
        res.render('login',{title: "login"});
    }).post('/login',(req, res, next)=>{

        passport.authenticate('login', (err, user, info)=>{
            if(err) { return next(err)}
            if(!user) {return res.redirect('/login'); }
            req.logIn(user, (err) =>{
                if(err) { return next(err)}
                return res.redirect('/profile/'+user.userName);
            })
        })(req, res, next);

    });
    
    app.get('/profile', auth.ensureLoggedIn(), (req, res)=>{
        res.redirect('/profile/'+req.user.userName);
    })

    // '/login' — default otherwise add param
    app.get('/profile/*', auth.ensureLoggedIn(), (req, res)=>{
        let user = req.user;
        res.render('profile',{
            profileName:user.userName, 
            title: user.userName,
            firstName: user.firstName,
            lastName: user.lastName
        });
    })
        
    app.get('/logout',(req, res) => {
        req.logout();
        res.redirect('/');
    });
        
    app.get('/signup',auth.ensureLoggedOut('/profile'), (req, res) => {
        res.render('signup', {title: "signup"});
    }).post('/signup', passport.authenticate('signup',{       
        failureRedirect: '/signup',
        successRedirect: '/profile',
        failureFlash : false
    }))

    return (req, res, next)=>{
        next();
    }
}