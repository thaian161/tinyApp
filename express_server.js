const express = require('express');
const app = express();
const PORT = 3000; // default port 8080
const morgan = require('morgan');
//The body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body.
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Generate random 6 alphanumeric character to use for unique shortURL
function generateRandomString() {
  let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  let charactersLength = characters.length;

  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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

//Route to localhost:8080
app.get('/', (req, res) => {
  const user = users[req.cookies.userID];
  const templateVars = {
    urls: urlDatabase,
    user,
  };
  res.render('urls_index', templateVars);
});

// //adding route for /urls
// app.get('/urls', (req, res) => {
//   const templateVars = { urls: urlDatabase };
//   res.render('urls_index', templateVars);
// });

//Add a routes for /urls
app.get('/urls', (req, res) => {
  const user = users[req.cookies.userID];
  const templateVars = {
    urls: urlDatabase,
    user,
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const user = users[req.cookies.userID];
  const templateVars = {
    urls: urlDatabase,
    user,
  };
  res.render('urls_new', templateVars);
});

//adding route for /urls/:shortURL
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

app.post('/urls', (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];

  res.redirect(longURL);
});

//Create DELETE route using POST
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;

  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

//Create EDIT route using POST
app.post('/urls/:id', (req, res) => {
  const id = req.params.id;
  const user = users[req.cookies.userID];
  const templateVars = {
    user,
    urls: urlDatabase,
    id,
  };
  res.redirect('/urls');
});

//Refactor GET route for login form
app.get('/login', (req, res) => {
  const user = users[req.cookies.userID];
  const templateVars = { urls: urlDatabase, user };
  res.render('login', templateVars);
});

//Create route for login form
app.post('/login', (req, res) => {
  // console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

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

//Create route for log-out => clear the cookie when user logout
app.post('/logout', (req, res) => {
  //clearing the cookie is in fact how you log out
  // having a cookies mean you are log in, how you know if the user is log in or not
  res.clearCookie('user');
  res.redirect('/urls');
});

// checks if an email already exists in users
const getUserByEmail = function (email, users) {
  for (const id in users) {
    if (users[id].email === email) {
      return id;
    }
  }
  return undefined;
};

//GET route to register
app.get('/register', (req, res) => {
  const user = users[req.cookies.userID];
  const templateVars = { urls: urlDatabase, user };
  res.render('register', templateVars);
});

//POST route to register
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = generateRandomString();

  if (email === '' || password === '') {
    res.status(400).send('Error400: Missing either email or password');
  }

  if (getUserByEmail(email, users)) {
    res.status(400).send('Error400: This email has been registered');
  }

  users[userID] = {
    id: userID,
    email,
    password,
  };

  res.cookie('userID', userID);
  res.redirect('/urls');
});

// wild card => caught all werid paths request from user
app.get('*', (req, res) => {
  res.redirect('/register');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
