const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check whether username or password is missing
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }
  
    // Check whether the username already exists
    if (isValid(username)) {
      return res.status(409).json({
        message: "User already exists"
      });
    }
  
    // Add the new user to the users array
    users.push({
      username: username,
      password: password
    });
  
    return res.status(200).json({
      message: "User successfully registered. Now you can login"
    });
  });

// Get the book list available in the shop

public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res
        .status(200)
        .type('application/json')
        .send(JSON.stringify(book, null, 4));
    }
  
    return res.status(404).json({
      message: "Book not found for the provided ISBN"
    });
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const result = {};
  
    bookKeys.forEach(function (key) {
      if (books[key].author === author) {
        result[key] = books[key];
      }
    });
  
    return res
      .status(200)
      .type('application/json')
      .send(JSON.stringify(result, null, 4));
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const result = {};
  
    bookKeys.forEach(function (key) {
      if (books[key].title === title) {
        result[key] = books[key];
      }
    });
  
    return res
      .status(200)
      .type('application/json')
      .send(JSON.stringify(result, null, 4));
  });

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({
        message: "Book not found for the provided ISBN"
      });
    }
  
    return res
      .status(200)
      .type('application/json')
      .send(JSON.stringify(book.reviews, null, 4));
  });

  // Task 10: Get all books using async/await
const getAllBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/');
  
      console.log(JSON.stringify(response.data, null, 4));
  
      return response.data;
    } catch (error) {
      console.error("Error retrieving books:", error.message);
      throw error;
    }
  };

 // Task 11: Get book details by ISBN using async/await with Axios
const getBookByISBN = async (isbn) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/isbn/${encodeURIComponent(isbn)}`
      );
  
      console.log(JSON.stringify(response.data, null, 4));
  
      return response.data;
    } catch (error) {
      console.error(
        "Error retrieving book by ISBN:",
        error.response ? error.response.data : error.message
      );
  
      throw error;
    }
  }; 

  // Task 12: Get books by author using async/await with Axios
const getBooksByAuthor = async (author) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/author/${encodeURIComponent(author)}`
      );
  
      console.log(JSON.stringify(response.data, null, 4));
  
      return response.data;
    } catch (error) {
      console.error(
        "Error retrieving books by author:",
        error.response ? error.response.data : error.message
      );
  
      throw error;
    }
  };

  // Task 13: Get books by title using async/await with Axios
const getBooksByTitle = async (title) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
      );
  
      console.log(JSON.stringify(response.data, null, 4));
  
      return response.data;
    } catch (error) {
      console.error(
        "Error retrieving books by title:",
        error.response ? error.response.data : error.message
      );
  
      throw error;
    }
  };

  module.exports.general = public_users;
  module.exports.getAllBooks = getAllBooks;
  module.exports.getBookByISBN = getBookByISBN;
  module.exports.getBooksByAuthor = getBooksByAuthor;
  module.exports.getBooksByTitle = getBooksByTitle;
  