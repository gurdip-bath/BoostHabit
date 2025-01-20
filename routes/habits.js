const express = require('express');
const router = express.Router();
const pool = require('../server/db'); 
const { updateHabitProgress } = require ('../routes/progressHelpers');

// CREATE a new habit
router.post('/', async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const { name, description, frequency, target_completion } = req.body;

        // Validate required fields
        if (!name || !frequency || target_completion === undefined) {
            return res.status(400).json({
                error: 'Name, frequency, and target_completion are required fields.',
            });
        }

        // Insert the new habit into the database
        const newHabit = await pool.query(
            `INSERT INTO habits 
            (name, description, frequency, target_completion) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
            [name, description || null, frequency, target_completion]
        );

        // Log the inserted habit for debugging
        console.log('Inserted Habit:', newHabit.rows[0]);

        // Return the newly created habit
        res.status(201).json(newHabit.rows[0]);
    } catch (err) {
        // Log the error
        console.error('Error inserting habit:', err.message);

        // Handle potential database errors
        if (err.code === '23502') { // NOT NULL violation
            return res.status(400).json({
                error: 'A required field is missing or invalid.',
            });
        }

        // General error response
        res.status(500).send('Server Error');
    }
});



// READ all habits
router.get('/', async (req, res) => {
    try {
        const allHabits = await pool.query('SELECT * FROM habits');
        res.json(allHabits.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// READ a single habit by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const habit = await pool.query('SELECT * FROM habits WHERE id = $1', [id]);
        if (habit.rows.length === 0) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        res.json(habit.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// UPDATE a habit
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, frequency } = req.body;
        const updatedHabit = await pool.query(
            'UPDATE habits SET name = $1, description = $2, frequency = $3 WHERE id = $4 RETURNING *',
            [name, description, frequency, id]
        );
        if (updatedHabit.rows.length === 0) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        res.json(updatedHabit.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE a habit
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHabit = await pool.query('DELETE FROM habits WHERE id = $1 RETURNING *', [id]);
        if (deletedHabit.rows.length === 0) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        res.json({ message: 'Habit deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// PATCH: Mark a habit as completed
router.patch('/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;

        // Helper function to update habit progress
        const updatedProgress = await updateHabitProgress(id);

        // Respond with the updated habit progress
        res.json(updatedProgress);
    } catch (err) {
        console.error('Error marking habit as completed:', err.message);

        // Handles errors from the helper function
        if (err.message === 'Habit progress not found') {
            return res.status(404).json({ message: err.message})
        }
        res.status(500).send('Server Error');
    }
});



module.exports = router;