import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import AddBook from "./components/AddBook";
import EditBook from "./components/EditBook";

function App() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [showEditBookForm, setShowEditBookForm] = useState(false);
  const [editBook, setEditBook] = useState(null);

  useEffect(() => {
    fetchInitialBooks();
  }, []);

  const fetchInitialBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/books/all`, {
        params: {
          limit,
        },
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching initial books:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/books`, {
        params: {
          page,
          limit,
          search: searchTerm,
        },
      });
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
      setPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchBooks();
  };

  const handleAddBookSubmit = async (formData) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/books`,
        formData
      );
      const newBook = response.data;
      setBooks([...books, newBook]);
      setShowAddBookForm(false);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleClick = () => {
    setShowAddBookForm(true);
  };

  const handleEditBook = (book) => {
    setEditBook(book);
    setShowEditBookForm(true);
  };

  const handleEditBookSubmit = async (updatedBook) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/books/${updatedBook._id}`,
        updatedBook
      );
      const updatedBookData = response.data;
      setBooks(
        books.map((book) =>
          book._id === updatedBookData._id ? updatedBookData : book
        )
      );
      setShowEditBookForm(false);
      setEditBook(null);
    } catch (error) {
      console.error("Error editing book:", error);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      console.log(bookId);
      await axios.delete(`http://localhost:3000/books/${bookId}`);
      setBooks(books.filter((book) => book._id !== bookId));
      console.log(`Deleted book with ID: ${bookId}`);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div>
      <div>
        <button className="custom-button" onClick={handleClick}>
          Add Books
        </button>
      </div>
      {showAddBookForm && <AddBook onSubmit={handleAddBookSubmit} />}
      {showEditBookForm && editBook && (
        <EditBook book={editBook} onSubmit={handleEditBookSubmit} />
      )}
      <input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <Table responsive="sm">
        <thead>
          <tr>
            <th style={{ padding: "30px" }}>#</th>
            <th style={{ padding: "30px" }}>Name</th>
            <th style={{ padding: "30px" }}>Description</th>
            <th style={{ padding: "30px" }}>Publish Date</th>
            <th style={{ padding: "30px" }}>Price</th>
            <th style={{ padding: "30px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book._id}>
              <td style={{ padding: "30px" }}>{index + 1}</td>
              <td style={{ padding: "30px" }}>{book.name}</td>
              <td style={{ padding: "30px" }}>{book.description}</td>
              <td style={{ padding: "30px" }}>
                {new Date(book.publishDate).toLocaleDateString()}
              </td>
              <td style={{ padding: "30px" }}>{book.price}</td>
              <td style={{ padding: "30px" }}>
                <button onClick={() => handleEditBook(book)}>Edit</button>
                <button onClick={() => handleDelete(book._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {totalPages > 1 && (
        <div>
          <button
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span>
            {" "}
            Page {page} of {totalPages}{" "}
          </span>
          <button
            onClick={() =>
              setPage((prevPage) => Math.min(prevPage + 1, totalPages))
            }
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
