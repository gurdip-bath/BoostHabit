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
