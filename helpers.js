
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

const database ={
  texas: "aaron@aa.com",
  dob : 12/23/44,
  email: "aaron@gmail.com",
  dog: " big"
};

email ="aaron@gmail.com" 

const getUserByEmail = function(email, database) {
  for (const key in database) {
    if (email === database[key]){
      console.log("this worked  ");
  } else {
      console.log(" this failed");
    }

}

}
getUserByEmail(email, database)

module.exports = {
  generateRandomString,
 
};