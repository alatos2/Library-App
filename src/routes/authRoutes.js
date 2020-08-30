const express = require('express');
const { MongoClient } = require('mongodb');
const passport = require('passport');
const debug = require('debug')('app:authRoutes');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signup')
    .get((req, res) => {
      res.render('signup', {
        title: 'Sign Up',
        nav
      });
    })
    .post((req, res) => {
      debug(req.body);
      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connected to the server');

          const db = client.db(dbName);

          const col = db.collection('users');
          const user = { username, password };
          const results = await col.insertOne(user);
          debug(results);
          // create user
          req.login(results.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err);
        }
      }());
    });

  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/auth/signin');
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });

  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        title: 'Sign In',
        nav
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));

  return authRouter;
}

module.exports = router;
