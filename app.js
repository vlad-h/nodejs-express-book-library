const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' },
];

const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.set('views', './src/views');
/* If you want to test templating engine pug */
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.get('/', (req, res) => {
  /* Change to index-pug or index-ejs if you want to test pug or ejs templating engine */
  res.render('index', {
    list: ['a', 'b', 'c'],
    title: 'MyLibrary',
    nav,
  });
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
