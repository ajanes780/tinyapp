
const urlsForUser = function (id) {
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



module.exports = {
  generateRandomString,
  urlsForUser,
  
};