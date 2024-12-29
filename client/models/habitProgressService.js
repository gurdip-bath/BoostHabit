const pool = require('../server/db');

/**
 * Fetches progress entries for a specific habit, ordered by completion_date.
 * @param {number} habit_id - The ID of the habit to fetch progress for.
 * @returns {Promise<Array>} - A list of progress entries with completion_date.
 */
async function getProgressEntriesByHabitId(habit_id) {
    try {
        const result = await pool.query(
            'SELECT completion_date FROM habit_progress WHERE habit_id = $1 ORDER BY completion_date',
            [habit_id]
        );
        return result.rows;
    } catch (err) {
        console.error('Error fetching progress entries:', err.message);
        throw err; // Re-throw the error to be handled by the calling function
    }
}

module.exports = {
    getProgressEntriesByHabitId
};
