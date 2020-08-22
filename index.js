const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('App');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

dotenv.config();

const { port } = process.env;

const nav = [{ link: '/books', title: 'Books' }, { link: '/authors', title: 'Authors' }];
const bookRoute = require('./src/routes/bookRoutes')(nav);
const adminRoute = require('./src/routes/adminRoutes')(nav);
const authRoute = require('./src/routes/authRoutes')(nav);

app.use(morgan('tiny'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css/')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

app.use(cookieParser());
app.use(session({ secret: 'library' }));

require('./src/config/passport.js')(app);

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/books', bookRoute);
app.use('/admin', adminRoute);
app.use('/auth', authRoute);
// middleware
// app.use((res, req, next) => {
//   debug('I am a dbugger');
// });

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'views/index.html'));
  res.render('index',
    {
      title: 'My Library',
      nav: [{ link: '/books', title: 'Books' }, { link: '/authors', title: 'Authors' }]
    });
});

app.listen(port, () => {
  debug(chalk.green(`listening on port ${port}`));
});
