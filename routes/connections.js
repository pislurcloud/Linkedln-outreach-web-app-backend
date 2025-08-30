// routes/outreach.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator'); // ← Add validation

const Outreach = require('../models/Outreach');

/**
 * POST /api/outreach
 * @desc    Save a new outreach entry (manually sent by user)
 * @access  Private
 */
router.post(
  '/',
  auth,
  [
    body('name', 'Name is required').trim().notEmpty(),
    body('company', 'Company is required').trim().notEmpty(),
    body('jobTitle', 'Job title is required').trim().notEmpty(),
    body('connectionNote', 'Connection note is required')
      .trim()
      .notEmpty()
      .isLength({ max: 300 })
      .withMessage('Note must be 300 characters or less'),
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, company, jobTitle, connectionNote } = req.body;

    try {
      const outreach = new Outreach({
        name,
        company,
        jobTitle,
        connectionNote,
        userId: req.user.id,
      });

      await outreach.save();
      res.status(201).json({
        msg: 'Outreach saved! You can now copy and send it manually.',
        outreach,
      });
    } catch (err) {
      console.error('[Server] Error saving outreach:', err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * GET /api/outreach
 * @desc    Get all outreach entries for logged-in user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const outreaches = await Outreach.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(outreaches);
  } catch (err) {
    console.error('[Server] Error fetching outreach:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
