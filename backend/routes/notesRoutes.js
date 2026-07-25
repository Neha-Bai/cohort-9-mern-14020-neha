const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/Note');
const protect = require('../middleware/authMiddleware');
const logger = require('../logger');

const router = express.Router();

router.use(protect);

// CREATE a new note
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newNote = await Note.create({
      user: req.userId,
      title: title.trim(),
      content: content || ''
    });

    logger.info({ userId: req.userId, noteId: newNote._id }, 'Note created');

    res.status(201).json({ message: 'Note created', note: newNote });

  } catch (error) {
    logger.error({ err: error }, 'Create note error');
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// READ all notes belonging to the logged-in user
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ updatedAt: -1 });
    res.status(200).json({ notes });
  } catch (error) {
    logger.error({ err: error }, 'Fetch notes error');
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// READ a single note by ID (only if it belongs to this user)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid note ID' });
    }

    const note = await Note.findOne({ _id: req.params.id, user: req.userId });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ note });
  } catch (error) {
    logger.error({ err: error }, 'Fetch note error');
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// UPDATE a note (only if it belongs to this user)
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid note ID' });
    }

    const { title, content } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    logger.info({ userId: req.userId, noteId: updatedNote._id }, 'Note updated');

    res.status(200).json({ message: 'Note updated', note: updatedNote });
  } catch (error) {
    logger.error({ err: error }, 'Update note error');
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// DELETE a note (only if it belongs to this user)
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid note ID' });
    }

    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    logger.info({ userId: req.userId, noteId: req.params.id }, 'Note deleted');

    res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    logger.error({ err: error }, 'Delete note error');
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;