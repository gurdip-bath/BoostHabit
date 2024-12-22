const express = require ('express');
const router = express.router();
const pool = require('../server/db');

// CREATE a new progress entry for a specific habit

router.post('/', async (req, res) => {
    try {
        const { name, description, date, progress_value} = req.body;
        const habitprogress = await pool.query(
            'INSERT INTO habit_progress (name, description, date, progress_value) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, date, progress_value]
        );
        console.log ('You have made progress', habitprogress.rows[0]);
        res.json(habitprogress.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    
    

    }
});