const express = require('express');
const router = express.Router();
const pool = require('../server/db'); // Assuming you're using PostgreSQL with a connection pool

 // CREATE a new habit
router.post('/', async (req, res) => {
    try {
        const { name, description, frequency } = req.body;
        const newHabit = await pool.query(
            'INSERT INTO habits (name, description, frequency) VALUES ($1, $2, $3) RETURNING *',
            [name, description, frequency]
        );
        res.json(newHabit.rows[0]);
    } catch (err) {
        console.error(err.message);
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

module.exports = router;