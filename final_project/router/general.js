const express = require('express');
const axios = require('axios');
const booksdb = require('./booksdb.js');
const auth_users = require('./auth_users.js');
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  // Write your code here to handle user registration
  // Example: Save the user details to the database
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Fetch the book list using Axios
  axios.get('https://api.example.com/books')
    .then((response) => {
      const bookList = response.data;
      return res.status(200).json(bookList);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: "Error fetching book list" });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Fetch book details by ISBN using Axios
  axios.get(`https://api.example.com/books/${isbn}`)
    .then((response) => {
      const book = response.data;
      return res.status(200).json(book);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: "Error fetching book details" });
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  // Filter books by author from the booksdb array
  const books = booksdb.filter((book) => book.author === author);

  return res.status(200).json(books);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  // Filter books by title from the booksdb array
  const books = booksdb.filter((book) => book.title === title);

  return res.status(200).json(books);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Fetch book review by ISBN using Axios
  axios.get(`https://api.example.com/books/${isbn}/review`)
    .then((response) => {
      const review = response.data;
      return res.status(200).json(review);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: "Error fetching book review" });
    });
});

module.exports.general = public_users;
