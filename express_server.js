const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser"); // for post requests
const {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
} = require(`./helpers`);
const cookieSession = require("cookie-session");
const morgan = require("morgan");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // template engine
app.use(morgan("dev"));

app.use(
  cookieSession({
    name: "session",
    keys: ["Aaron"],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

let users = {};
const urlDatabase = {};

// routes //

app.get("/register", (req, res) => {
  const templateVars = {
    email: null,
  };
  res.render("reg", templateVars);
});

app.post("/register", (req, res) => {
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
        password: userHashPw,
      };
    }
    req.session.user_id = users[randomID]; // the user object begins here
    res.redirect("/urls");
    return; // setting a cookie for user_id and then directing user to urls page
  }
  res.sendStatus(400).send(" you are here 2");
});

app.get("/login", (req, res) => {
  const userPassword = req.session.password;
  const userEmail = req.session.email;
  const templateVars = {
    email: req.session.email,
  };
  res.render("login", templateVars);
});

//  login and log out functions
app.post("/login", (req, res) => {
  const userPassword = req.body.password;
  const userEmail = req.body.email;
  if (!userEmail || !userPassword) {
    res.sendStatus(400);
  }
  let userExist = false;
  for (const usersId in users) {
    const usersInfo = users[usersId];
    if (
      usersInfo.email === userEmail &&
      bcrypt.compareSync(userPassword, usersInfo.password)
    ) {
      userExist = true;
      req.session.user_id = users[usersId].id;
      res.redirect("/urls");
      return;
    }
  }
  res.sendStatus(400);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.get("/urls", function (req, res) {
  if (!req.session.user_id) {
    res.status(400).send("Access Denied. Please Login or Register!");
  }
  const templateVars = {
    urls: urlsForUser(req.session.user_id.id, urlDatabase),
    email: req.session.user_id.email,
  };

  res.render("urls_index", templateVars);
});

// get requests for urls_new
app.get("/urls/new", (req, res) => {
  if (req.session.user_id === undefined) {
    return res.status(400).send("Access Denied. Please Login or Register!");
  }
  const templateVars = {
    email: req.session.user_id.email,
  };
  return res.render("urls_new", templateVars);
});

// action of edit button in url_index page and the action of submit button in url_show page
app.post(`/urls/:shortURL`, (req, res) => {
  const userUrls = urlsForUser(req.session.user_id.id, urlDatabase);
  const val = urlDatabase[req.params.shortURL];

  if (req.session.user_id.id === val.userID) {
    urlDatabase[req.params.shortURL] = {
      longURL: req.body.longURL,
      userID: req.session.user_id.id,
    };

    return res.redirect(`/urls`);
  } else {
    return res.status(401).send(`You cant do that.`);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session.user_id) {
    res.send(" Please Login  ");
  }
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    email: req.session.user_id.email,
  };
  return res.render("urls_show", templateVars);
});
// to delete urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = urlDatabase[req.params.shortURL].userID;
  const shortUrl = req.params.shortURL;
  if (userId === urlDatabase[shortUrl].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls`);
  } else {
    res.status(401).send(" You cant do that ");
  }
});

// to add a new short url
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  let newUserId = req.session.user_id.id;
  urlDatabase[shortURL] = { longURL, userID: newUserId };
  res.redirect(`/urls/${shortURL}`);
});

////  this route is for sharing the urls
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.sendStatus(404);
  } else {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
