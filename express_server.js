//require('dotenv').config(); // Reads the content of .env and add them to process.env
const express = require('express'); // Imports the express framework / library
const path = require('path'); // Compat for file paths
const PORT = 3000; // default port 8080
const morgan = require('morgan');
const bodyParser = require('body-parser'); //The body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body.
const cookieParser = require('cookie-parser'); // // Parses the cookie string to fancy cookie object
const cookieSession = require('cookie-session'); // Parse & Encrypt / Decrypt the cookie string
const bcrypt = require('bcryptjs'); // Hashing functionality for our app

const app = express(); //Instantiate the express server and we call it app
const app2 = express(); //an act of create an instance, we can have 2 express apps run at the same time
const salt = bcrypt.genSaltSync(10); // Generate salt values for hashing

//=====VIEW engine setup=====
app.set('view engine', 'ejs'); // We specify what we want to use (EJS) as view engine
app.set('views', path.join(__dirname, 'views')); // Specify where the templates are

//====MIDDLEWARES==========
app.use(morgan('dev')); //// Activate the morgan the logger in "dev" mode
app.use(express.json()); // Will parse the incoming payload (cargo / content / data) from JSON -> Object
app.use(bodyParser.urlencoded({ extended: true })); //// Will parse the incoming payload (cargo / content / data) from form -> Object
app.use(cookieParser()); // Parses the cookie string to fancy cookie object
app.use(express.static(path.join(__dirname, 'public'))); // Enables read access to the public folder in our server
// app.use(
//   cookieSession({
//     name: 'session',
//     key: 'abc',
//     // Cookie Options
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//   })
// );

//================HELPER FUNCTIONS===============================
//======FETCH USER URL (urls belong to users)=========
const fetchUserUrls = (userID) => {
  let userURLS = {};
  for (let shortURL in urlDatabase) {
    if (userID === urlDatabase[shortURL].userID) {
      //this is an object, not an array so we cannot push
      userURLS[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLS;
};

//=====GENERATE RANDOM STRING=======================
function generateRandomString() {
  let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  let charactersLength = characters.length;

  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//===CHECK IF EMAIL ALREADY EXISTS IN USER OBJ===========
const getUserByEmail = function (email, database) {
  for (const id in database) {
    if (database[id].email === email) {
      return database[id];
    }
  }
  return undefined;
};

//=======URL DATABASE===========
const urlDatabase = {
  b2xVn2: {
    userID: 'b2xVn2',
    longURL: 'https://www.linkedin.com/in/anbui161/',
  },
  '9sm5xK': {
    userID: '9sm5xK',
    longURL: 'https://github.com/thaian161',
  },
};

//=======USERS DATABASE===========
const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'a@b.com',
    password: '123',
  },
  userRandomID: {
    id: 'userRandomID',
    email: 'thaian161@yahoo.com',
    password: 'thaian',
  },
  userRandomID: {
    id: 'userRandomID',
    email: 'hai@bui.com',
    password: 'hai',
  },
};

//====GET route to local host==========
app.get('/', (req, res) => {
  const user = users[req.cookies.userID];
  const templateVars = {
    urls: urlDatabase,
    user,
  };
  res.render('urls_index', templateVars);
});

//==== GET route to /urls ==========
app.get('/urls', (req, res) => {
  const user = users[req.cookies.userID];
  const userURLS = fetchUserUrls(req.cookies.userID);
  const templateVars = {
    urls: userURLS,
    user,
  };
  res.render('urls_index', templateVars);
});

//==== GET route to /urls/new ==========
app.get('/urls/new', (req, res) => {
  const user = users[req.cookies.userID];
  const templateVars = {
    urls: urlDatabase,
    user,
  };

  //user has login or registered
  if (user) {
    return res.render('urls_new', templateVars);
  }

  //if user not log in or register
  if (!user) {
    // redirect to /login
    return res.redirect('/login');
  }
});

//==== GET route to /urls/:shortURL ==========
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const user = users[req.cookies.userID];
  const templateVars = {
    shortURL,
    longURL,
    user,
  };
  res.render('urls_show', templateVars);
});

//==== POST route to /urls ==========
app.post('/urls', (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies.userID,
  };
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

//==== GET route to /urls/:shortURL ==========
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];

  res.redirect(longURL);
});

//==== Create DELETE route using POST ==========
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;

  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

//==== Create EDIT route using POST ==========
app.post('/urls/:shortURL', (req, res) => {
  console.log('does it work?');
  const shortURL = req.params.shortURL;

  console.log('shortURL', shortURL);
  const longURL = req.body.longURL;
  const user = users[req.cookies.userID];
  urlDatabase[shortURL] = {
    longURL,
    userID: req.cookies.userID,
  };
  res.redirect('/urls');
});

//==== GET route to /login ==========
app.get('/login', (req, res) => {
  const user = users[req.cookies.userID];
  const templateVars = { urls: urlDatabase, user };
  res.render('login', templateVars);
});

//==== POST route to /login ==========
app.post('/login', (req, res) => {
  // const email = req.body.email;
  // const password = req.body.password;
  const { email, password } = req.body; //use object shorthand instead 2 lines above

  const user = getUserByEmail(email, users);

  if (!user) {
    return res.status(403).send("User doesn't exist");
  }
  if (user.password !== password) {
    return res.status(403).send('Incorrect password');
  }

  res.cookie('userID', user.id);

  res.redirect('/urls');
});

//=====Create POST route for /logout => clear the cookie when user logout=============
app.post('/logout', (req, res) => {
  //clearing the cookie is in fact how you log out
  // having a cookies mean you are log in, how you know if the user is log in or not
  res.clearCookie('userID');
  res.redirect('/login');
});

//======= GET route to /register ==========
app.get('/register', (req, res) => {
  const user = users[req.cookies.userID];
  const templateVars = { urls: urlDatabase, user };
  res.render('register', templateVars);
});

//======= POST route to /register ==========
app.post('/register', (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (email === '' || password === '') {
    return res.status(400).send('Error400: Missing either email or password');
  }

  if (getUserByEmail(email, users)) {
    return res.status(400).send('Error400: This email has been registered');
  }

  users[userID] = {
    id: userID,
    email,
    password,
  };

  res.cookie('userID', userID);
  res.redirect('/urls');
});

//======= GET route to wild card => caught all werid paths request from user=======
app.get('*', (req, res) => {
  res.redirect('/register');
});

//====App listen on PORT==============
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
