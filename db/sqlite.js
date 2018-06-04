const Sequelize = require('Sequelize');
const sqlite3 = require('sqlite3').verbose();

const sequelize = new Sequelize('Users', 'null', null, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: '/Users/tkasozi/Dropbox/school2018/test-app/db/UserDB.sqlite'
  });
  const Op = Sequelize.Op;

  //model Users can be private
  const Users = sequelize.define('Users',
  {
      ID:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userName: Sequelize.STRING,
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      passWord: Sequelize.STRING
  },{
      freezeTableName: true,
      timestamps: false,
      operatorsAliases: {
          $and: Op.and,
          $or: Op.or,
          $eq: Op.eq,
          $gt: Op.gt,
          $lt: Op.lt,
          $lte: Op.lte,
          $like: Op.like
        }
  });   

module.exports = {
  createUser: (params, cb) =>{
    process.nextTick(() => {
       /**
             sequelize.transaction().then(function(t) {
          Users.create({
            userName: params.username, 
            firstName: params.firstname, 
            lastName: params.lastname, 
            passWord: params.password
          }, {
              transaction: t
          }).then(record =>{
              t.commit();
              if(record !== null){return cb(null, record.dataValues)}
              else new Error("Error will be caught below")
          }).catch(function(error) {
              cb(new Error(error.errors[0].message));
              t.rollback();
          });
        });
      */
      let newUser = new Users();
      newUser.userName = params.username;
      newUser.firstName = params.firstname;
      newUser.lastName = params.lastname;
      newUser.passWord = params.password;
      
      newUser.save(function(err, user) {
        if (err){throw err;} 
      }).then(record => {
        return cb(null, record.dataValues);
      }).catch(function(error) {
        return cb(new Error(error.errors[0].message));
      });
    })
  },
  //login
  findOne : (username, password, cb) => {
    process.nextTick(() => {
        Users.find({where: {userName: username, passWord: password}}).then(record => {
          if (record !== null) {
            return cb(null, record.dataValues);
          }else{
            return cb(new Error("User does not exist."), null);
          }
        });
    })
  },
  findById : (id, cb) =>{
    process.nextTick(() => {
      Users.find({where: {ID: id}}).then(record => {
        if(record != null){
          return cb(null, record.dataValues);
        }else{
          return cb("does not exist", null);
        }
      });
    })
  }
};