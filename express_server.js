const express = require('express');
const app = express();
const PORT = 7070; // default port 8080
const morgan = require('morgan');
app.use(morgan('dev'));

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
