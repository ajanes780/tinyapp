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


const  urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "Shorty": "https://www.ignitewebdesign.ca"
  
};




app.get("/", (req, res) => {
  res.send("Hello and welcome to my server ");
// add few links to my pages here
});


app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies['username'],
    email: req.cookies["user_id"]["email"]
  
  };
  res.render("urls_index", templateVars);
});


// building the new user registration page

app.post('/register',(req, res) =>{
  // generate a random user id and store it in user object with data
  let randomID = generateRandomString();
  
  users[randomID] = {
    id : randomID,
    email: req.body.email,
    password: req.body.password
  };

  res.cookie('user_id', users[randomID]);
  // console.log(users[randomID]);
  console.log( "this is req.cookies :",req.cookies["user_id"]["email"]);
  res.redirect('/urls');


});

app.get('/register',(req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies['username'],
    email: req.cookies["user_id"]["email"]
  };
  res.render('reg', templateVars);
});





// login and log oput functions // how i set a cookie
app.post('/login',(req, res) => {
  let username = req.body.username;
  res.cookie('username', username);
  console.log(username);
  res.redirect(`/urls`);
});

app.post('/logout',(req, res) => {
  res.clearCookie('email');

  res.redirect('/urls');

});



// get requests for urls_new
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies['username'],
    email: req.cookies["user_id"]["email"]
  };
  res.render("urls_new",templateVars); // form addition
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

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies['username'],
    email: req.cookies["user_id"]["email"]
  };
  res.render("urls_show", templateVars);
});
// to delete a url
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(urlDatabase[req.params.shortURL]);
  delete urlDatabase[req.params.shortURL]; // uses the key to access
  res.redirect(`/urls`);      //  needs a call back ?
});
// to add a new shorty
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString() {
  return Math.random().toString(20).substr(2, 6);

}
