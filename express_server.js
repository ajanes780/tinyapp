const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser"); // for post requests
const { generateRandomString, urlsForUser , getUserByEmail} = require(`./helpers`);
const cookieSession = require('cookie-session');
const morgan = require('morgan');



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); // template engine
app.use(morgan('dev'));
// app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: [ 'Aaron'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


let users = {};




const urlsForUser = function(id) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    const urlInfoObj = urlDatabase[shortURL];
    if (urlInfoObj.userID === id) {
      userUrls[shortURL] = urlInfoObj;
    }
  }
  return userUrls;
};


const urlDatabase = {};






app.get('/register',(req, res) => {
  const templateVars = {
    email: null
  };
  res.render('reg', templateVars);
});

app.post('/register',(req, res) =>{
  const userPassword = req.body.password;
  const userEmail = req.body.email;
  const userHashPw = bcrypt.hashSync(userPassword, 10);

  if (userEmail === "" || userPassword === "") {
    res.sendStatus(400).send("please submit both a email and a password");
  } else {
    let userExist = false;
    for (const usersId in users) {
      const usersInfo = users[usersId];
      if (usersInfo.email === userEmail) {
        userExist = true;
      }
    }
    let randomID = generateRandomString();
    if (!userExist) {

      users[randomID] = {
        id: randomID,
        email: userEmail,
        password: userHashPw
      };
    }
    req.session.user_id = users[randomID] ;
    res.redirect("/login");
    return;   // setting a cookie for user_id and then directing user to urls page
  }
  res.sendStatus(400).send(" you are here 2");
});


app.get('/login',(req, res) => {
  const userPassword = req.session.password;
  const userEmail = req.session.email;
    
    
  const templateVars = {
    email: req.session.email

  };
  res.render('login',templateVars);
});
  
//  login and log oput functions // how i set a cookie
app.post('/login',(req, res) => {
  const userPassword = req.body.password;
  const userEmail = req.body.email;
  console.log("*** THIS IS REQ.SESSON 1 ,", req.session);
  if (!userEmail || !userPassword) {
    res.sendStatus(400).send(" you are here 3");
  }
  let userExist = false;
  for (const usersId in users) {
    const usersInfo = users[usersId];
    if (usersInfo.email === userEmail && bcrypt.compareSync(userPassword, usersInfo.password)) {
      userExist = true;
      // res.cookie('user_id', users[usersId].id);
      console.log("*** THIS IS REQ.SESSION USERID 2",req.session);      
      req.session.user_id = users[usersId].id;
      res.redirect('/urls');
      return;
    }
  }
  res.sendStatus(400).send(" YOU ARE HERE 4 ");
});

app.post('/logout',(req, res) => {
  
  req.session = null;
  res.redirect('/login');
});




app.get("/urls", function(req, res) {
  if (!req.session.user_id) {
    res.status(400).send("Access Denied. Please Login or Register!");
  }
  const templateVars = {
    urls: urlsForUser(req.session.user_id),
    email: users[req.session.user_id].email
  };
  res.render("urls_index", templateVars);
});

// get requests for urls_new
app.get("/urls/new", (req, res) => {
  if (req.session === undefined) {
    return  res.status(400).send("Access Denied. Please Login or Register!");
  }
  const templateVars = {
    email: users[req.session.user_id].email
  };
  return res.render("urls_new", templateVars);
});

// action of edit button in url_index page and the action of submit button in url_show page
app.post(`/urls/:id`, (req, res) => {
  const userUrls = urlsForUser(req.session['user_id']);
  if (Object.keys(userUrls).includes(req.params.id)) {
    const shortURL = req.params.id;
    // urlDatabase[shortURL].longURL = req.body.newURL
    return res.redirect(`/urls/:shortURL`);
  } else {
    return res.status(401).send(`You cant do that.`);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  

  const templateVars = {
    shortURL:req.params.shortURL,
    longURL:urlDatabase[req.params.shortURL].longURL,
    email:users[req.session.user_id].email

  };
  return res.render("urls_show", templateVars);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  console.log("urlDatabase",urlDatabase);
  console.log("req.session.user_id",req.session.user_id);
  
  const userId = urlDatabase[req.params.shortURL].userID
  console.log("userId", userId);
  const shortUrl = req.params.shortURL;
  console.log("shortUrl", shortUrl);
  console.log("*** THIS IS REQ.SESSSION ", req.session);
  if (userId === urlDatabase[shortUrl].userID   ){
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls`);
  } else{
    res.status(401).send(" You cant do that ");
  }
});









// to add a new shorty
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL
  let newUserId = req.session.user_id
  urlDatabase[shortURL] = { longURL,  userID: newUserId };
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.sendStatus(404);
  } else {
    const longURL = urlDatabase[req.params.shortURL].longURL;
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







