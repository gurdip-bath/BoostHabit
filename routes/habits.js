const express = require('express');
const router = express.Router();
const pool = require('../server/db'); 
const { updateHabitProgress } = require ('../routes/progressHelpers');

// CREATE a new habit
router.post('/', async (req, res) => {
    try {
        const { name, description, frequency, target_completion } = req.body;

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

        const habitId = newHabit.rows[0].id;

        // Automatically create a habit_progress entry
        await pool.query(
            `INSERT INTO habit_progress (habit_id, completion_date, completion_count, current_streak, longest_streak)
             VALUES ($1, NOW(), 0, 0, 0)`,
            [habitId]
        );

        res.status(201).json(newHabit.rows[0]); // Return the newly created habit
    } catch (err) {
        console.error('Error inserting habit:', err.message);
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
        
        // Start a database transaction to ensure both updates succeed or fail together
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Update the habit's basic metrics
            const updatedHabit = await client.query(
                `UPDATE habits
                 SET current_streak = current_streak + 1, 
                     longest_streak = GREATEST(longest_streak, current_streak + 1),
                     experience_points = experience_points + 100
                 WHERE id = $1 
                 RETURNING *`, 
                [id]
            );

            // Update the detailed progress tracking
            await updateHabitProgress(id);

            await client.query('COMMIT');
            
            res.json(updatedHabit.rows[0]);
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error updating habit:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});




module.exports = router;