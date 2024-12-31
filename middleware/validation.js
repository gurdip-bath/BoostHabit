/**
 * Middleware to validate habit progress input.
 */
function validateHabitProgress(req, res, next) {
    const { habit_id, completion_date, completion_count, current_streak, longest_streak } = req.body;

    // Ensure habit_id is provided and is a valid number
    if (!habit_id || typeof habit_id !== 'number') {
        return res.status(400).json({ error: 'habit_id is required and must be a valid number.' });
    }

    // Ensure completion_date is provided and is a valid date
    if (!completion_date) {
        return res.status(400).json({ error: 'completion_date is required.' });
    }

    const date = new Date(completion_date);
    if (isNaN(date.getTime())) {
        return res.status(400).json({ error: 'completion_date must be a valid date.' });
    }

    // Validate optional fields if they are provided
    if (completion_count !== undefined && typeof completion_count !== 'number') {
        return res.status(400).json({ error: 'completion_count must be a number.' });
    }

    if (current_streak !== undefined && typeof current_streak !== 'number') {
        return res.status(400).json({ error: 'current_streak must be a number.' });
    }

    if (longest_streak !== undefined && typeof longest_streak !== 'number') {
        return res.status(400).json({ error: 'longest_streak must be a number.' });
    }

    // Proceed to the next middleware or route handler
    next();
}

module.exports = { validateHabitProgress };

