const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser"); // for post requests 
const cookieParser = require('cookie-parser');

const  urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "Shorty": "https://www.ignitewebdesign.ca"
  
};

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); // template engine
app.use(cookieParser());




app.get("/", (req, res) => {
  res.send(  "Hello and welcome to my server ");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies['username'],
  
  };
  res.render("urls_index", templateVars);
});




app.post('/login',(req, res) => {
  let username = req.body.username;
  res.cookie('username', username );
    console.log(username);
  res.redirect(`/urls`)
})

app.post('/logout',(req, res) => {
  res.clearCookie('username' );

res.redirect('/urls')

});




app.get("/urls/new", (req, res) => {
  const templateVars= {
    username: req.cookies['username'],
  }   
  res.render("urls_new",templateVars  ); // form addition 
});
// action of edit button in url_index page and the action of submit button in url_show page
app.post(`/urls/:id`, (req, res) => {
  // if the form in the url_show page contains an input(longURL) it will edit the long url and redirect you back to urls_index page
  if (req.body.longURL) {
    urlDatabase[req.params.id] = req.body.longURL
    res.redirect(`/urls`)
    // if no input was made in form it will just stay in the url_show page
  } else {
    res.redirect(`/urls/${req.params.id}`)
  }
})


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
    username: req.cookies['username'] };
  res.render("urls_show", templateVars);
});
// to delete a url  
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(urlDatabase[req.params.shortURL]);
delete urlDatabase[req.params.shortURL] // uses the key to access 
  res.redirect(`/urls`);      //  needs a call back ?
});
// to add a new shorty 
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect( `/urls/${shortURL}`);     
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString() {
return Math.random().toString(20).substr(2, 6)

}
