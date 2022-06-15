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
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

//Route to localhost:8080
app.get('/', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies['username'],
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
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies['username'],
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies['username'],
  };
  res.render('urls_new', templateVars);
});

//adding route for /urls/:shortURL
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const username = req.cookies['username'];
  const templateVars = {
    shortURL,
    longURL,
    username,
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
  
  const templateVars = {
    username: req.cookies['username'],
    urls: urlDatabase,
  };
  res.redirect('/urls');
});

//Create route for login form
app.post('/login', (req, res) => {
  console.log(req.body);
  const { username } = req.body; //getting username from the body
  res.cookie('username', username); //save username in cookie

  //update the templateVars to use for render urls_index
  const templateVars = {
    username: req.cookies['username'],
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});

//Create route for log-out => clear the cookie when user logout
app.post('/logout', (req, res) => {
  //clearing the cookie is in fact how you log out
  // having a cookies mean you are log in, how you know if the user is log in or not
  res.clearCookie('username');
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
