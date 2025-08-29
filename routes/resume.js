const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const supabase = require('../config/supabase');

const router = express.Router();

// Get user resume data
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: resume, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({ resume: resume || null });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// Update resume data
router.put('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeData = req.body;

    const { data: existingResume } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;
    if (existingResume) {
      // Update existing resume
      result = await supabase
        .from('resumes')
        .update({ ...resumeData, updated_at: new Date() })
        .eq('user_id', userId)
        .select()
        .single();
    } else {
      // Create new resume
      result = await supabase
        .from('resumes')
        .insert([{ user_id: userId, ...resumeData }])
        .select()
        .single();
    }

    if (result.error) throw result.error;

    res.json({
      message: 'Resume updated successfully',
      resume: result.data
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

module.exports = router;
