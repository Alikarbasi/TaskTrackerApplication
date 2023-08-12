var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var tasksRouter = require('./routes/tasks');
var categoriesRouter = require('./routes/categories');
var config = require('./config/global');
var mongoose = require('mongoose');
// Import passport modules
const passport = require('passport');
const session = require('express-session');
const githubStrategy = require('passport-github2').Strategy;



var app = express();

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((message) => {
    console.log('Connected successfully!');
  })
  .catch((error) => {
    console.log(`Error while connecting! ${error}`);
  });
  // HBS Helper Method to select values from dropdown lists
const hbs = require('hbs');
// function name and helper function with parameters
hbs.registerHelper('createOption', (currentValue, selectedValue) => {
  // initialize selected property
  var selectedProperty = '';
  // if values are equal set selectedProperty accordingly
  if (currentValue == selectedValue) {
    selectedProperty = 'selected';
  };
   // return html code for this option element
  // return new hbs.SafeString('<option '+ selectedProperty +'>' + currentValue + '</option>');
  return new hbs.SafeString(`<option ${selectedProperty}>${currentValue}</option>`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Configure passport module https://www.npmjs.com/package/express-session
// secret is a salt value used for hashing
// save forces the session to be saved back to the session store 
// even if it's never modified during the request
app.use(session({
  secret: 'taskTracker',
  resave: false,
  saveUninitialized: false
}));
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
// Link passport to the user model
const User = require('./models/user');
passport.use(User.createStrategy());

// Configure passport-github2 with the API keys and user model
// We need to handle two scenarios: new user, or returning user
passport.use(new githubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackUrl
},
  // create async callback function
  // profile is github profile
  async (accessToken, refreshToken, profile, done) => {
    // search user by ID
    const user = await User.findOne({ oauthId: profile.id });
    // user exists (returning user)
    if (user) {
      // no need to do anything else
      return done(null, user);
    }
    else {
      // new user so register them in the db
      const newUser = new User({
        username: profile.username,
        oauthId: profile.id,
        oauthProvider: 'Github',
        created: Date.now()
      });
      // add to DB
      const savedUser = await newUser.save();
      // return
      return done(null, savedUser);
    }
  }
));

// Set passport to write/read user data to/from session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//
app.use('/', indexRouter);
//
app.use('/tasks',tasksRouter);
//
app.use('/categories',categoriesRouter);

// function name and helper function with parameters
hbs.registerHelper('createOption', (currentValue, selectedValue) => {
  // initialize selected property
  var selectedProperty = '';
  // if values are equal set selectedProperty accordingly
  if (currentValue == selectedValue) {
    selectedProperty = 'selected';
  }
  // return html code for this option element
  // return new hbs.SafeString('<option '+ selectedProperty +'>' + currentValue + '</option>');
  return new hbs.SafeString(`<option ${selectedProperty}>${currentValue}</option>`);
});

// helper function to format date values
hbs.registerHelper('toShortDate', (longDateValue) => {
  if (longDateValue instanceof Date && !isNaN(longDateValue)) {
    // If longDateValue is a valid Date object, format it as a short date
    return new hbs.SafeString(longDateValue.toLocaleDateString('en-CA'));
  } else {
    // Handle the case where longDateValue is not a valid Date
    return ''; // Return an empty string or an appropriate default value
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
