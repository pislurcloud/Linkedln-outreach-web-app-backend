const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const supabase = require('../config/supabase');

const router = express.Router();

// Get user analytics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get application count
    const { count: applicationCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get connection count
    const { count: connectionCount } = await supabase
      .from('connections')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get recent applications
    const { data: recentApplications } = await supabase
      .from('applications')
      .select('*, jobs(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      analytics: {
        totalApplications: applicationCount || 0,
        totalConnections: connectionCount || 0,
        responseRate: 0, // Calculate based on your logic
        interviewRate: 0, // Calculate based on your logic
        recentApplications: recentApplications || []
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
