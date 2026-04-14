
export const validateTask = (req, res, next) => {
  const { title, status, priority } = req.body;

  if (req.method === 'POST' && !title) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }
  

  if (title && (title.length < 3 || title.length > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Title must be between 3 and 100 characters'
    });
  }
  

  if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be pending, in-progress, or completed'
    });
  }
  
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({
      success: false,
      message: 'Priority must be low, medium, or high'
    });
  }
  
  next();
};