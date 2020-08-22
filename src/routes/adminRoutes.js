const express = require('express');
const debug = require('debug')('app:adminRoutes');
const { MongoClient } = require('mongodb');

const adminRouter = express.Router();

const allBooks = require('../models/books');

function router(nav) {
  adminRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });
          debug('connected to the server');

          const db = client.db(dbName);

          const response = await db.collection('books').insertMany(allBooks);

          res.json(response);
        } catch (err) {
          debug(err.stack);
        }

        client.close();
      }());
    });

  return adminRouter;
}

module.exports = router;
