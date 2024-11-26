const mongoose = require("mongoose");

//model
const workoutSchema = new mongoose.Schema({
    exercise: {type: String, required: true},
    sets:{type: Number, required: true},
    weight: {type: Number, required: true},
    reps: {type: Number, required: true},
    notes: {type: String, required: false}
});

const wtrack = mongoose.model("data", workoutSchema);
module.exports = wtrack;