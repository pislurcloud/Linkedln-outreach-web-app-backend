const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const supabase = require('../config/supabase');

const router = express.Router();

// Get user connections
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: connections, error } = await supabase
      .from('connections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ connections });
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
});

// Add new connection
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, title, company, linkedin_url } = req.body;

    const { data: connection, error } = await supabase
      .from('connections')
      .insert([
        { user_id: userId, name, title, company, linkedin_url }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Connection added successfully',
      connection
    });
  } catch (error) {
    console.error('Error adding connection:', error);
    res.status(500).json({ error: 'Failed to add connection' });
  }
});

module.exports = router;
