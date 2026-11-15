const form = document.querySelector("#book-form");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const list = document.querySelector("#book-list");
const message = document.querySelector("#message");
const cancelButton = document.querySelector("#cancel");
let editId = null;

async function showBooks() {
  const response = await fetch("/api/books");
  const books = await response.json();
  list.replaceChildren();

  books.forEach(function (book) {
    const card = document.createElement("article");
    card.className = "book";
    const title = document.createElement("h3");
    title.textContent = book.title;
    const author = document.createElement("p");
    author.textContent = "By " + book.author;
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
      editId = book.id;
      titleInput.value = book.title;
      authorInput.value = book.author;
      form.querySelector("button[type=submit]").textContent = "Save changes";
      cancelButton.hidden = false;
      titleInput.focus();
    });
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "plain-button";
    deleteButton.addEventListener("click", async function () {
      await fetch("/api/books/" + book.id, { method: "DELETE" });
      message.textContent = "Book deleted.";
      showBooks();
    });
    card.append(title, author, editButton, deleteButton);
    list.append(card);
  });
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const book = { title: titleInput.value.trim(), author: authorInput.value.trim() };
  const url = editId === null ? "/api/books" : "/api/books/" + editId;
  const method = editId === null ? "POST" : "PUT";
  const response = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book)
  });
  const result = await response.json();
  if (!response.ok) {
    message.textContent = result.message;
    return;
  }
  message.textContent = editId === null ? "Book added." : "Book updated.";
  clearForm();
  showBooks();
});

function clearForm() {
  form.reset();
  editId = null;
  form.querySelector("button[type=submit]").textContent = "Add book";
  cancelButton.hidden = true;
}

cancelButton.addEventListener("click", clearForm);
showBooks();
