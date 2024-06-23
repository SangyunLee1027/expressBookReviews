const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  if(req.body.username && req.body.password){
    users[req.body.username] = req.body.password;
    return res.send({"message": "Customer Register Successfully! You can now login."});
  }
  return res.send({"message": "Customer failed to register. Username or Password is missing."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const book = books[isbn];
    
    if (book) {
      resolve(book);
    } else {
      reject('Book not found');
    }
  })
    .then(book => res.send(book))
    .catch(error => res.status(404).send({ error: error }));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  Object.values(books).forEach(book => {
  if(book["author"] === req.params.author){
    return res.send(book);
  }
});
  return res.status(300).json({message: "No Book written by " + req.params.author});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  Object.values(books).forEach(book => {
  if(book["title"] === req.params.title){
    return res.send(book);
  }
});
  return res.status(300).json({message: "No Book titled  " + req.params.title});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.send(books[req.params.isbn]["reviews"]);
});

module.exports.general = public_users;
