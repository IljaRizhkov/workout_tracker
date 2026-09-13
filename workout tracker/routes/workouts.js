const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const auth = require('../middleware/authMiddleware');

// POST /api/workouts/add
router.post('/add', auth, async (req, res) => {
    const {exercise, sets, reps, weight, date} = req.body;

    if (!exercise || !sets || !reps || !weight ) {
        return res.status(400).json({message: 'All fields are required'});
    }

    try {
        const newWorkout = await Workout.create({
            user: req.user.id, //Identifikation takes from JWT token
            exercise,
            sets,
            reps,
            weight,
            date: date || Date.now(), 
    });
    
    res.status(201).json({message: 'Workout added successfully', workout: newWorkout});

    } catch (err) {
        res.status(500).json({message: 'Server Error', error: err.message});
    }
});

module.exports = router;


