const express = require('express');
const debug = require('debug')('app:bookRoutes');
const { MongoClient, ObjectID } = require('mongodb');

// const allBooks = require('../models/books');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.get('/', (req, res) => {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });
        debug('connected to the server');

        const db = client.db(dbName);

        const col = await db.collection('books');
        const books = await col.find().toArray();
        debug(books);

        res.render('bookListView', {
          title: 'My Books',
          nav,
          books
        });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  });

  bookRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });
        debug('connected to the server');

        const db = client.db(dbName);

        const col = await db.collection('books');
        const book = await col.findOne({ _id: new ObjectID(id) });
        debug(book);

        res.render('bookView', {
          title: 'My Book',
          nav,
          book
        });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  });

  return bookRouter;
}

module.exports = router;
