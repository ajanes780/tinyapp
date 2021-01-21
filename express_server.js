const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser"); // for post requests
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); // template engine
app.use(cookieParser());



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


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};



app.get('/register',(req, res) => {
 // i dont have templateVars here as they are not defined yet 
  const templateVars = {
  email: null
}
  res.render('reg', templateVars );
});

app.post('/register',(req, res) =>{
  // generate a random user id and store it in user object with data
  if (req.body.email === "" || req.body.password === "" ) {
    res.sendStatus(400)
  }
  let userExist = false;
  for (const usersId in users) {
    const usersInfo = users[usersId];
    if (usersInfo.email === req.body.email) {
        userExist = true;
      }
    }
    if (!userExist) {
      let randomID = generateRandomString()
      users[randomID] = {
        id: randomID,
        email: req.body.email,
        password: req.body.password
      }
      // setting a cookie for user_id and then directing user to urls page
      res.cookie('user_id', randomID)
      res.redirect("/urls")
    }
    res.sendStatus(400)
  })


  app.get('/login',(req, res) => {
    // i dont have templateVars here as they are not defined yet 
    const templateVars = {
      email: null
    }
    res.render('login',templateVars );
  });
  
  //  login and log oput functions // how i set a cookie
  app.post('/login',(req, res) => {
    if (req.body.email === "" || req.body.password === "" ) {
    res.sendStatus(400);
  }
  let userExist = false;
  for (const usersId in users) {
    const usersInfo = users[usersId];
    if (usersInfo.email === req.body.email && usersInfo.password === req.body.password) {
      userExist = true;
      res.cookie('user_id', users[usersId].id); 
      
      res.redirect('/urls')
    }
  } 
  res.sendStatus(400)
});   

app.post('/logout',(req, res) => {
  res.clearCookie('user_id');
  
  res.redirect('/login');
});




app.get("/urls", function (req, res) {
 
  if (req.cookies['user_id'] === undefined) {
    res.status(400).send("Access Denied. Please Login or Register!")
  }
  const templateVars = {
    urls: urlDatabase,
    email: users[req.cookies['user_id']].email
  }
  res.render("urls_index", templateVars)
})


// get requests for urls_new
app.get("/urls/new", (req, res) => {
 
  if (req.cookies['user_id'] === undefined) {
    res.status(400).send("Access Denied. Please Login or Register!")
  }
  const templateVars = {
    urls: urlDatabase,
    email: users[req.cookies['user_id']].email
  }
  res.render("urls_index", templateVars)
});
// action of edit button in url_index page and the action of submit button in url_show page
app.post(`/urls/:id`, (req, res) => {
  // if the form in the url_show page contains an input(longURL) it will edit the long url and redirect you back to urls_index page
  if (req.body.longURL) {
    urlDatabase[req.params.id] = req.body.longURL;
    res.redirect(`/urls`);
    // if no input was made in form it will just stay in the url_show page
  } else {
    res.redirect(`/urls/${req.params.id}`);
  }
});
// makes a short url
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    email:users[req.cookies.user_id].email 
  };
  res.render("urls_show", templateVars);
});
// to delete a url
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(urlDatabase[req.params.shortURL]);
  delete urlDatabase[req.params.shortURL]; 
  res.redirect(`/urls`);     
});
// to add a new shorty
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.sendStatus(404)
  } else {
    const longURL = urlDatabase[req.params.shortURL].longURL
    res.redirect(longURL);
  }
});


app.get("/", (req, res) => {
  res.send("Hello and welcome to my server  ");
  // add few links to my pages here
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString() {
  return Math.random().toString(20).substr(2, 6);
  
}