
let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};




const getUser  = function (users )  {
  for (const y in users) {
    for (const keys in y)
      console.log(" this user is found ", keys);
    
    }  
  }
getUser(users)