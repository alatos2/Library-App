const passport = require('passport');
require('./strategies/locale.strategy')();

module.exports = function passportConfig(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  // stores user in session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // retrieves user in session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
