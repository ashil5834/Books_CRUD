const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.post('/', async (req, res) => {
  const { name, description, publishDate, price } = req.body;
  try {
    const book = new Book({ name, description, publishDate, price });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const searchQuery = {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ]
  };

  try {
    const books = await Book.find(searchQuery)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Book.countDocuments(searchQuery);
    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', async (req, res) => {
    try {
      const books = await Book.find();
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, publishDate, price } = req.body;
  
    try {
      const updatedBook = await Book.findByIdAndUpdate(
        id,
        { name, description, publishDate, price },
        { new: true }
      );
      if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(updatedBook);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
        console.log(id);
      const deletedBook = await Book.findByIdAndDelete(id);
      if (!deletedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
