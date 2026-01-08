//all file imports
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); //loads the environment variables from the .env file
const Fruit = require('./models/fruit.js');

//use express (using app)
//use morgan
//connect to mongoDB
const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
mongoose.connect(process.env.MONGODB_URI); //connects to mongoDB using the connection string
mongoose.connection.on('connected', () => {
    console.log(`connected to MongoDB ${mongoose.connection.name}`)
})

//routes
app.get('/', async (req, res) => {
    res.render('index.ejs');
});

//Get fruits(index page)
app.get("/fruits", async (req,res) => {
    const allFruits = await Fruit.find();
    console.log('All of my fruits', allFruits);
    res.render('fruits/index.ejs', {fruits: allFruits});
})

//get for new fruits
app.get('/fruits/new', (req,res) => {
    res.render('fruits/new.ejs');
});

//post fruits
app.post('/fruits', async (req, res) => {
    if (req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body); //create fruit in mongoDB
    console.log(req.body); //we get the req body (the request body) from the form data
    res.redirect('/fruits'); //opnce we get that data, redirect back to the form creation page
})

//listen
// app.listen(3000, () => {
//     console.log('Listening on port 3000');
// });