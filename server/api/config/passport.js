var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
const Rut = require('rutjs');

passport.use(new localStrategy({
    usernameField: 'rut'
  },
  function(username, password, done){
    username = new Rut(username).getNiceRut(false);
    User.findOne({rut: username }, function(err, user){
      if (err) {return done(err); }
      if (!user) {
        return done(null, false, {
          message: 'Los datos ingresados no son validos. Intente nuevamente'
        });
      }
      if(!user.validPassword(password)){
        return done(null, false, {
          message: 'Los datos ingresados no son validos. Intente nuevamente'
        });
      }
      return done(null, user);
    })
  }
));