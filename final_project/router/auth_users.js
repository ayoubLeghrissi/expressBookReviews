const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // write code to check if the username is valid
};

const authenticatedUser = (username, password) => {
  // write code to check if username and password match the one we have in records
};

const generateToken = (user) => {
  const token = jwt.sign({ username: user.username }, 'your-secret-key', { expiresIn: '1h' });
  return token;
};

// only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user exists and password is correct
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate and return a JWT
  const token = generateToken(user);
  return res.json({ message: "Login successful", token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username; // Get the username from the authenticated user
  const review = req.query.review; // Get the review from the request query

  // Find the book by ISBN
  const book = books.books[isbn];

  // Check if the book exists
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or modify the user's review
  book.reviews = book.reviews || {};
  book.reviews[username] = review;

  return res.json({ message: "Review added or modified successfully", review: book.reviews[username] });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
