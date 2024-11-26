//Imports
const express = require('express');
const router = express.Router();
const wtrack = require("../models/workoutlist");

//Home (Splash) Page
router.get('/home', (req, res) => {
    res.render('home', {title:'Home'});
});

//Workout Tracker Page
router.get('/', async (req, res) => {
    try {
        const workoutlist = await wtrack.find();
        res.render('index', {
            title: 'Workout Tracker',
            workoutlist: workoutlist
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

//Add Workouts Page
router.get('/add_workouts', (req, res) => {
    res.render('add_workouts', {title:'Record Workout'});
});

//Edit Workouts Page
router.get('/edit/:id', async (req, res) => {
    try {
        let id = req.params.id;
        // Use the model method to find the workout by id
        const workout = await wtrack.findById(id);
        
        if (!workout) {
            // If the workout is not found, redirect to the home page
            return res.redirect('/');
        }

        // Render the edit page if the workout is found
        res.render('edit_workouts', { title: 'Edit Workout', wtrack: workout });
    } catch (err) {
        // If an error occurs during the query, redirect to the home page
        console.error(err);  // Log the error for debugging
        res.redirect('/');
    }
});

//data update
router.post('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { exercise, sets, weight, reps, notes } = req.body;

        // Update the workout in the database using findByIdAndUpdate
        const updatedWorkout = await wtrack.findByIdAndUpdate(id, {
            exercise,
            sets,
            weight,
            reps,
            notes
        }, { new: true }); // The `{ new: true }` option returns the updated document

        if (!updatedWorkout) {
            // If no workout was found and updated, send a response
            return res.status(404).json({ message: 'Workout not found', type: 'danger' });
        }

        // If update is successful, set the session message and redirect
        req.session.message = {
            type: 'success',
            message: 'Workout Updated Successfully!',
        };
        res.redirect('/');
    } catch (err) {
        // Catch any unexpected errors and send a response
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: err.message, type: 'danger' });
    }
});

//data deletion

// Route to show the confirmation page
router.get('/delete/:id/confirm', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Find the workout to confirm it's the correct one
        const workout = await wtrack.findById(id);
        
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found', type: 'danger' });
        }

        // Render a confirmation page with workout details
        res.render('confirm_delete', {
            title: 'Confirm Deletion',
            workout: workout,  // Pass the workout data to the confirmation page
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message, type: 'danger' });
    }
});

// Route to handle the actual deletion of the workout
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Perform the deletion
        const deletedWorkout = await wtrack.findByIdAndDelete(id);

        if (!deletedWorkout) {
            return res.status(404).json({ message: 'Workout not found', type: 'danger' });
        }

        // Set a session message and redirect after successful deletion
        req.session.message = {
            type: 'info',
            message: 'Workout Deleted Successfully!',
        };
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message, type: 'danger' });
    }
});


module.exports = router;