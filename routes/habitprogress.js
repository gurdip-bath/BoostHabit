const express = require ('express');
const router = express.router();
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
            'SELECT * FROM habit_progress WHERE habit_id = $1', // Use parameterized query to prevent SQL injection
            [habit_id]
        );

        // Send the retrieved data as a JSON response with a status of 200 (OK)
        res.status(200).json(habitProgress.rows);
    } catch (err) {
        // Log the error message to the console for debugging purposes
        console.error('Error retrieving habit progress:', err.message);

        // Respond with a 500 status code indicating a server error
        res.status(500).send('Failed to retrieve habit progress from the database.');
    }
});


