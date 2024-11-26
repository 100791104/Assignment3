//importing files
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const wtrack = require("./models/workoutlist");

const app = express();
const PORT = 3000;

//establishing database connection
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connection to Database Successful"));

//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(session({
    secret:"lalakey",
    saveUninitialized:true,
    resave:false,
}));

app.use((req,res,next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

//setting the view engine
app.set('view engine', 'ejs');

//route prefix
app.use("", require('./routes/routes'));

//data upload
app.post('/add', async (req, res) => {
    try {
        const { exercise, sets, weight, reps, notes } = req.body;
        const userin = new wtrack({ exercise, sets, weight, reps, notes });
        await userin.save();
        console.log(userin);
        req.session.message = {type: 'success', message: 'Workout Added Successfully!'};
        res.redirect('/');
    } catch (error) {
        console.error('Error saving workout:', error);
        req.session.message = {type: 'danger', message: 'Workout was not Added Successfully!'};
        res.redirect('/');
    }
});

app.listen(PORT, () => {
    console.log("Server started at http://localhost:3000");
});

