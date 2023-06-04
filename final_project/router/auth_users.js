const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Write your code to check if the username is valid
    // Example: Perform validation logic such as checking length, characters, or format
  
    // Assuming a valid username should have a minimum length of 3 characters
    const minLength = 3;
    if (username.length < minLength) {
      return false;
    }
  
    // Add more validation logic here based on your requirements
  
    return true; // Return true if the username is valid
  };
  
  const authenticatedUser = (username, password) => {
    // Write your code to check if the username and password match the records in the database
    // Example: Assuming you have a 'users' collection/table in your database
    // You would typically use a library like Mongoose or Sequelize to interact with the database
  
    // Assuming you are using MongoDB with Mongoose
    const User = require('./models/user'); // Import the User model
  
    // Find the user by username
    return User.findOne({ username })
      .then((user) => {
        if (!user) {
          // User not found
          return false;
        }
        
        // Compare the password hash with the provided password
        return user.comparePassword(password)
          .then((isMatch) => {
            return isMatch; // Returns true if the password matches, false otherwise
          });
      })
      .catch((error) => {
        console.error(error);
        return false; // Return false in case of an error
      });
  };
  
  // Only registered users can login
  regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    // Validate the username
    if (!isValid(username)) {
      return res.status(400).json({ message: "Invalid username" });
    }
  
    // Authenticate the user
    if (authenticatedUser(username, password)) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
  
  // Add a book review
  regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
  
    // Find the book with the given ISBN in the 'books' array or database
    const book = books.find((book) => book.isbn === isbn);
  
    // If the book is found, add the review to the book's reviews array
    if (book) {
      book.reviews.push(review);
      return res.status(200).json({ message: "Book review added successfully" });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
  
    // Find the book with the given ISBN in the 'books' array or database
    const book = books.find((book) => book.isbn === isbn);
  
    // If the book is found, delete the review from the book's reviews array
    if (book) {
      // Assuming the review to be deleted is specified in the request body
      const { reviewId } = req.body;
  
      // Find the index of the review in the reviews array
      const reviewIndex = book.reviews.findIndex((review) => review.id === reviewId);
  
      // If the review is found, remove it from the array
      if (reviewIndex !== -1) {
        book.reviews.splice(reviewIndex, 1);
        return res.status(200).json({ message: "Book review deleted successfully" });
      } else {
        return res.status(404).json({ message: "Review not found" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
