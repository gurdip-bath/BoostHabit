// Import the database connection
const pool = require('../server/db');

// Function to update habit progress
async function updateHabitProgress(habitId) {
    try {
        // Update the habit_progress table
        const updatedProgress = await pool.query(
            `UPDATE habit_progress
             SET 
                complete = true,
                current_streak = current_streak + 1,
                longest_streak = GREATEST(longest_streak, current_streak),
                completion_date = NOW(),
                completion_count = completion_count + 1,
                updated_at = NOW()
             WHERE habit_id = $1
             RETURNING *`,
            [habitId]
        );

        // Throw an error if no rows are updated
        if (updatedProgress.rows.length === 0) {
            throw new Error('Habit progress not found.');
        }

        return updatedProgress.rows[0]; // Return the updated progress
    } catch (err) {
        throw new Error(`Error updating habit progress: ${err.message}`);
    }
}

// Export the function for use in other files
module.exports = {
    updateHabitProgress,
};
