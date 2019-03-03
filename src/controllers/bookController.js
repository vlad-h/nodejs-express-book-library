const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:book-controller');

const url = 'mongodb://localhost:27017';
const dbName = 'libraryApp';

function bookController(bookService, nav) {
  function getIndex(req, res) {
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected successfully to the server');

        const db = client.db(dbName);

        const col = await db.collection('books');
        const books = await col.find().toArray();

        res.render('bookListView', {
          title: 'MyLibrary',
          nav,
          books,
        });
      } catch (err) {
        debug(err.stack);
      }

      client.close();
    }());
  }
  function getById(req, res) {
    const { id } = req.params;
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected successfully to the server');

        const db = client.db(dbName);

        const col = await db.collection('books');
        const book = await col.findOne({ _id: new ObjectID(id) });
        debug(book);

        book.details = await bookService.getBookById(book.bookId);

        res.render('bookView', {
          title: 'MyLibrary',
          nav,
          book,
        });
      } catch (err) {
        debug(err.stack);
      }

      client.close();
    }());
  }

  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }

  return {
    getIndex,
    getById,
    middleware
  };
}

module.exports = bookController;
