//building the workout model

const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    exercise: {
        type: String,
        required: true
    },

    sets: {
        type: Number,
        required: true
    },

    reps: {
        type: Number,
        required: true,
    },

    weight: {
        type: Number,
        required: true,
    },
    
    date: {
        type: Date,
        default: Date.now,
        required: true /*,
        validate: {
            validator: function (value) {
                return value <= Date.now();
            },
            message: 'Date cannot be in the future'
        }*/
    }
});




module.exports = mongoose.model('Workout', WorkoutSchema);


