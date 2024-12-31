
  // Middleware to validate habit progress input.
 
function validateHabitProgress(req, res, next) {
    const { completion_date } = req.body;

    // Ensure completion_date is provided
    if (!completion_date) {
        return res.status(400).json({ error: 'completion_date is required.' });
    }

    // Check if completion_date is a valid date
    const date = new Date(completion_date);
    if (isNaN(date.getTime())) {
        return res.status(400).json({ error: 'completion_date must be a valid date.' });
    }

    // Proceed to the next middleware or route handler
    next();
}

module.exports = { validateHabitProgress };
