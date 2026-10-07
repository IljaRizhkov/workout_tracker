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


/*
// POST /api/workouts/list
router.post('/list', auth, async (req, res) => {
    const username = req.user.username;

    try {

        const workouts = await Workout.find({
            user: req.user.id,
            exercise: req.body.exercise,
            sets: req.body.sets,
            reps: req.body.reps,
            weight: req.body.weight,
            date: req.body.date
        });

        res.status(200).json(workouts);
    
    } catch (err) {
        res.status(500).json ({message: 'Server Error', error: err.message});
    }
});
*/

router.get ('/',auth, async (req, res) => {
    try {
        //fetch all workout that belong to the user
        const workouts = await Workout.find({user: req.user.id}).sort({date:-1});
        res.status(200).json(workouts);
    

    }catch (err) {
        res.status(500).json ({message: 'Server Error', error: err.message});
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({message: 'Workout not found'});
        }

        if (workout.user.toString() !== req.user.id) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        
        await workout.deleteOne();
        res.status(200).json({message : 'Workout deleted'});

    } catch (err) {
        res.status(500).json ({message: 'Server Error', error: err.message});
    }
});

module.exports = router;


