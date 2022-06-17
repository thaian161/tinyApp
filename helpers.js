//HELPERS FUNCTIONS

//============GENERATE RANDOM STRING==========================
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

//=========CHECK IF EMAIL ALREADY EXISTS IN USER OBJ===========
const getUserByEmail = (email, database) => {
  for (const id in database) {
    if (database[id].email === email) {
      return database[id];
    }
  }
  return undefined;
};

module.exports = { generateRandomString, getUserByEmail };
