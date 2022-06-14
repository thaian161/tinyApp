const express = require('express');
const app = express();
const PORT = 7070; // default port 8080
const morgan = require('morgan');

app.use(morgan('dev'));
app.set('view engine', 'ejs');

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

//adding route for /urls
app.get('/urls', (req, res) => {
  const templateVars = { urlDatabaseObj: urlDatabase };
  res.render('urls_index', templateVars);
});

//adding route for /urls/:shortURL
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {
    shortURL,
    longURL,
  };
  res.render('urls_show', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
