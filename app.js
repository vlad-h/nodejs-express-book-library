const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;
const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' },
];

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library123', resave: true, saveUninitialized: true }));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.set('views', './src/views');

const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);
/* If you want to test templating engine pug */
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
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
