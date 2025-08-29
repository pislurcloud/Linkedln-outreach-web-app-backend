const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const supabase = require('../config/supabase');

const router = express.Router();

// Get all jobs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get job by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Apply to job
router.post('/:id/apply', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if already applied
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', id)
      .eq('user_id', userId)
      .single();

    if (existingApplication) {
      return res.status(409).json({ error: 'Already applied to this job' });
    }

    // Create application
    const { data: application, error } = await supabase
      .from('applications')
      .insert([
        { job_id: id, user_id: userId, status: 'pending' }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ error: 'Failed to apply to job' });
  }
});

module.exports = router;
