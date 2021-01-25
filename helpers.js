//Determines which Urls the user has//
const urlsForUser = function (id, urlDatabase) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    const urlInfoObj = urlDatabase[shortURL];
    if (urlInfoObj.userID.id === id) {
      userUrls[shortURL] = urlInfoObj;
    }
  }
  return userUrls;
};

// this generates random 6 digit numbers to use as keys for tiny app
function generateRandomString() {
  return Math.random().toString(20).substr(2, 6);
}

// checks to see if a user email existis
const getUserByEmail = function (email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
};
