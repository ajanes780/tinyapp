
const urlsForUser = function (id, urlDatabase) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    const urlInfoObj = urlDatabase[shortURL];
    if (urlInfoObj.userID === id) {
      userUrls[shortURL] = urlInfoObj
    }
  }
  return userUrls
}



function generateRandomString() {
  return Math.random().toString(20).substr(2, 6);
  
}


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
  urlsForUser
};