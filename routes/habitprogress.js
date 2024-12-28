const express = require ('express');
const router = express.Router();
const pool = require('../server/db');

// CREATE a new progress entry for a specific habit
router.post('/', async (req, res) => {
    try {
        // Step 1: Destructure the required fields from the request body
        const { habit_id, completion_date, completion_count, current_streak, longest_streak } = req.body;

        // Step 2: Validate the required fields
        if (!habit_id || !completion_date) {
            return res.status(400).json({ error: 'habit_id and completion_date are required.' });
        }

        // Step 3: Insert data into the habit_progress table
        const newProgress = await pool.query(
            `INSERT INTO habit_progress 
            (habit_id, completion_date, completion_count, current_streak, longest_streak) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [
                habit_id, 
                completion_date, 
                completion_count || 1, // Use default of 1 if not provided
                current_streak || 0,  // Use default of 0 if not provided
                longest_streak || 0   // Use default of 0 if not provided
            ]
        );

        // Step 4: Log the result and send a response
        console.log('New Progress Entry:', newProgress.rows[0]);
        res.status(201).json(newProgress.rows[0]); // Send 201 status for created resource

    } catch (err) {
        // Step 5: Handle errors
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Define a GET endpoint to fetch progress for a specific habit based on its ID
router.get('/:habit_id', async (req, res) => {
    try {
        // Extract the habit_id from the request parameters
        const { habit_id } = req.params;

        // Query the database to fetch progress entries for the specified habit_id
        const habitProgress = await pool.query(
            'SELECT * FROM habit_progress WHERE habit_id = $1', 
            [habit_id]
        );

        // Send the retrieved data as a JSON response with a status of 200 (OK)
        res.status(200).json(habitProgress.rows);
    } catch (err) {
        console.error('Error retrieving habit progress:', err.message);
        res.status(500).send('Failed to retrieve habit progress from the database.');
    }
});

// Define a PUT endpoint to update habit progress for a specific habit based on its ID
router.put('/:habit_id', async (req, res) => {
    try {
        const { habit_id } = req.params;
        // Extract fields to update from the request body
        const { completion_date, completion_count, current_streak, longest_streak } = req.body;

        // Validate request body fields
        if (!completion_date || !completion_count || current_streak === undefined || longest_streak === undefined) {
            return res.status(400).json({ error: 'All fields (completion_date, completion_count, current_streak, longest_streak) are required.' });
        }

        // Query the database to update the specified habit progress record
        const updatedHabitProgress = await pool.query(
            `UPDATE habit_progress 
            SET 
                completion_count = $1, 
                current_streak = $2, 
                longest_streak = $3, 
                completion_date = $4 
            WHERE habit_id = $5 
            RETURNING *`, // Return the updated record to confirm changes
            [completion_count, current_streak, longest_streak, completion_date, habit_id]
        );

        // Check if no rows were affected, meaning the habit_id doesn't exist
        if (updatedHabitProgress.rows.length === 0) {
            return res.status(404).json({ message: 'Habit progress not found.' });
        }

        // Send the updated habit progress record as a JSON response
        res.status(200).json(updatedHabitProgress.rows[0]);
    } catch (err) {
        // Log the error message to the console for debugging purposes
        console.error('Error updating habit progress:', err.message);

        // Respond with a 500 status code indicating a server error
        res.status(500).send('Server Error');
    }
});


// Define a DELETE endpoint to delete a habit progress entry by habit_id
router.delete('/:habit_id', async (req, res) => {
    try {
        // Extract the habit_id from the request parameters
        const { habit_id } = req.params;

        // Execute the SQL query to delete the habit progress entry
        const deleteHabitProgress = await pool.query(
            'DELETE FROM habit_progress WHERE habit_id = $1 RETURNING *', // Use habit_id to identify the record
            [habit_id] // Pass the habit_id as a parameter
        );

        // Check if no rows were affected, meaning the habit_id doesn't exist
        if (deleteHabitProgress.rows.length === 0) {
            return res.status(404).json({ message: 'Habit progress not found.' });
        }

        // Send a success message with details of the deleted record
        res.status(200).json({
            message: 'Habit progress deleted successfully.',
            deleted: deleteHabitProgress.rows[0] // Include the deleted record in the response
        });
    } catch (err) {
        // Log the error message to the console for debugging purposes
        console.error('Error deleting habit progress:', err.message);

        // Respond with a 500 status code indicating a server error
        res.status(500).send('Failed to delete habit progress.');
    }
});

module.exports = router;