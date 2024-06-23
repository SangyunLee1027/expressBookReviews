const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    if(username in users){
        return true;
    }
    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    if (users[username] === password){
        return true;
    }

    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

    if(!username || !password){
        return res.status(404).json({ message: "Error logging in" });
    }

    if(!isValid(username)){
        return res.status(204).json({ message: "User does not exist." });
    }

    if(authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });    

        req.session.authorization = {
            accessToken, username
        };
        return res.status(200).send({ message: "User successfully logged in"}); }
        

  return res.status(208).json({ message: "Invalid Login. Check username and password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
    const username = req.body.username;
    const review = req.body.review;

    if(isbn && isbn in books){
        books[isbn]["reviews"][username] = review;
        return res.status(200).json({message: `Review for ${books[isbn]["title"]} succefully posted!`});
    }

  return res.status(404).json({message: "Book Does not exist!"});
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.body.username;

    if(isbn && isbn in books){
        if(username in books[isbn]["reviews"]){
            delete books[isbn]["reviews"][username];
            return res.status(200).json({message: `Review for ${books[isbn]["title"]} succefully deleted!`});

        }
        
        res.status(404).json({message: "Review does not exist!"});
    }


    return res.status(404).json({message: "Book Does not exist!"});
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
