// Import the database connection
const pool = require('../server/db');

// Function to update habit progress
async function updateHabitProgress(habitId) {
    try {
        const progressExists = await pool.query(
            'SELECT * FROM habit_progress WHERE habit_id = $1',
            [habitId]
        );

        if (progressExists.rows.length === 0) {
            throw new Error('Habit progress not found.');
        }

        const updatedProgress = await pool.query(
            `UPDATE habit_progress
             SET 
                current_streak = current_streak + 1,
                longest_streak = GREATEST(longest_streak, current_streak + 1),
                completion_date = NOW(),
                completion_count = completion_count + 1,
                updated_at = NOW()
             WHERE habit_id = $1
             RETURNING *`,
            [habitId]
        );

        return updatedProgress.rows[0];
    } catch (err) {
        throw new Error(`Error updating habit progress: ${err.message}`);
    }
}

// Export the function for use in other files
module.exports = {
    updateHabitProgress,
};
