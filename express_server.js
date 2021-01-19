const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser"); // for post requests 
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs"); // template engine

const  urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "Shorty": "https://www.ignitewebdesign.ca"
  
};




app.get("/", (req, res) => {
  res.send(  "Hello and welcome to my server "      );
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new"); // form addition 
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  
  console.log(req.body );  // Log the POST request body to the console
  
  // function addToObject(){
    let shortURL = generateRandomString()
    urlDatabase[shortURL] = req.body.longURL;
    console.log( urlDatabase );
    // }
  
    res.redirect(  `/urls/${shortURL}`);      //  needs a call back ?
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString() {
return Math.random().toString(20).substr(2, 6)

}
