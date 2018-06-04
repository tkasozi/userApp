let myPassport = require('../config/passport');

module.exports = (options)=>{
  
  myPassport(options.passport);

  return (req, res, next) =>{
    next();
  }
}
