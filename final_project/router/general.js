const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists
    if (users[username]) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Add the new user
    users[username] = { username, password };
  
    return res.status(201).json({ message: "User registered successfully" });
  });

// Task 10: Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
    try {
      const response = await axios.get('https://your-books-api-url'); // Replace with the actual URL of your books API
      const allBooks = response.data;
      return res.json(allBooks);
    } catch (error) {
      console.error('Error fetching all books:', error.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const requestedISBN = req.params.isbn;
      const response = await axios.get(`https://your-books-api-url/isbn/${requestedISBN}`); // Replace with the actual URL of your books API
      const bookDetails = response.data;
      
      if (bookDetails) {
        return res.json(bookDetails);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      console.error('Error fetching book details:', error.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  public_users.get('/author/:author', async function (req, res) {
    try {
      const requestedAuthor = req.params.author;
      const response = await axios.get(`https://your-books-api-url/author/${requestedAuthor}`); // Replace with the actual URL of your books API
      const booksByAuthor = response.data;
  
      if (booksByAuthor.length > 0) {
        return res.json(booksByAuthor);
      } else {
        return res.status(404).json({ message: "Books by the author not found" });
      }
    } catch (error) {
      console.error('Error fetching books by author:', error.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  public_users.get('/title/:title', async function (req, res) {
    try {
      const requestedTitle = req.params.title;
      const response = await axios.get(`https://your-books-api-url/title/${requestedTitle}`); // Replace with the actual URL of your books API
      const booksByTitle = response.data;
  
      if (booksByTitle.length > 0) {
        return res.json(booksByTitle);
      } else {
        return res.status(404).json({ message: "Books with the title not found" });
      }
    } catch (error) {
      console.error('Error fetching books by title:', error.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const requestedISBN = req.params.isbn;
  const bookReviews = books.books[requestedISBN]?.reviews || {};

  if (Object.keys(bookReviews).length > 0) {
    return res.json(bookReviews);
  } else {
    return res.status(404).json({ message: "Book reviews not found" });
  }
});

module.exports.general = public_users;
