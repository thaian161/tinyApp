const { assert } = require('chai');

// const { getUserByEmail } = require('../helpers.js');
const { getUserByEmail, generateRandomString } = require('../helpers.js');

const testUsers = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur',
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk',
  },
};

describe('# getUserByEmail', function () {
  it('should return undefined if email does not exist in testUser object', function () {
    const userEmail = getUserByEmail('a@test.com', testUsers);
    const expectedUserEmail = undefined;
    assert.deepEqual(
      userEmail,
      expectedUserEmail,
      'userEmail does not equal expectedUserEmail'
    );
  });

  it('should return testUsers[id] if email does exist in testUser object', function () {
    const userEmail = getUserByEmail('user2@example.com', testUsers);
    const expectedUserEmail = {
      id: 'user2RandomID',
      email: 'user2@example.com',
      password: 'dishwasher-funk',
    };
    assert.deepEqual(
      userEmail,
      expectedUserEmail,
      'userEmail does not equal expectedUserEmail'
    );
  });
});

describe('# generateRandomString', function () {
  it('should return a random 6 characters alphanumeric string', function () {
    const randomString = generateRandomString().length;
    const expectedLength = 6;

    assert.deepEqual(
      randomString,
      expectedLength,
      'randomString length is not 6 characters'
    );
  });
});
