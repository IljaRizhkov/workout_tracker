const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const auth = require('../middleware/authMiddleware');

// POST /api/workouts/add
router.post('/add', auth, async (req, res) => {
    const {exercise, sets, reps, weight, comment, date} = req.body;

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
            comment: comment || '',
            date: date || Date.now(), 
    });
    
    res.status(201).json({message: 'Workout added successfully', workout: newWorkout});

    } catch (err) {
        res.status(500).json({message: 'Server Error', error: err.message});
    }
});


// GET /api/workouts/
//token - person token in auth
router.get ('/',auth, async (req, res) => {
    try {
        //fetch all workout that belong to the user
        const workouts = await Workout.find({user: req.user.id}).sort({date:-1});
        res.status(200).json(workouts);
    

    }catch (err) {
        res.status(500).json ({message: 'Server Error', error: err.message});
    }
});


//DELETE /api/workouts/"id of exercise"
//token - person token in auth
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

//PATCH /api/workouts/"id of exercise"/comment
//token - person token in auth
router.patch('/:id/comment', auth, async (req, res) => {
    try{

        if (!req.body || !req.body.comment) {
            return res.status(400).json({message: 'Comment field is required'});
        }

        const workout = await Workout.findById(req.params.id);
        const {comment} = req.body;

        if (!workout) {
            return res.status(404).json({message: 'Workout not found'});
        }

        if (workout.user.toString() !== req.user.id) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        workout.comment = comment;
        await workout.save();

        res.status(200).json({message: 'Comment updated successfully', workout });

    }catch (err) {
        res.status(500).json ({message: 'Server Error', error: err.message});
    }
});






module.exports = router;
