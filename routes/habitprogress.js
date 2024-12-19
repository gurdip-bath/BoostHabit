const express = require ('express');
const router = express.router();
const pool = require('../server/db');

// CREATE a new progress entry for a specific habit

router.post('/', async (req, res) => {
    try {
        const { name, description, date, progress_value} = req. 
        body;

    }
});