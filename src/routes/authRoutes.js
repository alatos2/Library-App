const express = require('express');
const { MongoClient } = require('mongodb');
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
      // create user
      req.login(req.body, () => {
        res.redirect('/auth/profile');
      });
    });

  authRouter.route('/profile')
    .get((req, res) => {
      res.json(req.user);
    });

  return authRouter;
}

module.exports = router;
