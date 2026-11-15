const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// This lets Express read JSON sent by the browser.
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// A small starting list. It resets when the server restarts.
let books = [
  { id: 1, title: "The Little Prince", author: "Antoine de Saint-Exupery" },
  { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam" }
];
let nextId = 3;

// Read all books.
app.get("/api/books", function (request, response) {
  response.json(books);
});

// Add a book.
app.post("/api/books", function (request, response) {
  const title = request.body.title;
  const author = request.body.author;
  if (!title || !author) {
    return response.status(400).json({ message: "Title and author are required." });
  }
  const book = { id: nextId, title: title, author: author };
  nextId = nextId + 1;
  books.push(book);
  response.status(201).json(book);
});

// Change a book using its id.
app.put("/api/books/:id", function (request, response) {
  const id = Number(request.params.id);
  const book = books.find(function (item) { return item.id === id; });
  if (!book) return response.status(404).json({ message: "Book not found." });
  const title = request.body.title;
  const author = request.body.author;
  if (!title || !author) {
    return response.status(400).json({ message: "Title and author are required." });
  }
  book.title = title;
  book.author = author;
  response.json(book);
});

// Delete a book using its id.
app.delete("/api/books/:id", function (request, response) {
  const id = Number(request.params.id);
  const bookExists = books.some(function (item) { return item.id === id; });
  if (!bookExists) return response.status(404).json({ message: "Book not found." });
  books = books.filter(function (item) { return item.id !== id; });
  response.json({ message: "Book deleted." });
});

app.listen(port, function () {
  console.log("Book app is running at http://localhost:" + port);
});
