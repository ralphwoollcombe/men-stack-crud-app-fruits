//all file imports
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); //loads the environment variables from the .env file
const Fruit = require('./models/fruit.js');

//use express (using app)
//use morgan
//connect to mongoDB
const app = express();
app.use(morgan('dev'));
app.use(methodOverride('_method'));
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

//show route - specific data
//url looks something like fruits/:id
app.get('/fruits/:fruitId', async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    console.log('found fruit', foundFruit);
    res.render("fruits/show.ejs", {fruit: foundFruit});
})

app.delete("/fruits/:fruitId", async (req,res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect('/fruits');
})

app.put("/fruits/:fruitId", async (req,res) => {
    if (req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    //first parameter is the id we use to find the fruit
    //second is the data from the form to update the fruit
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);
    res.redirect(`/fruits/${req.params.fruitId}`)
})

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

//edit route
//GET fruits/:fruitId/edit
//have a look at routing table for the edit route + create route
//update route
// /fruits/:fruitId
app.get('/fruits/:fruitId/edit', async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    console.log('found fruit for edit', foundFruit);
    // res.send(`This is the edit route for ${foundFruit.name}`);
    res.render('fruits/edit.ejs', {fruit: foundFruit});
});

// listen
// app.listen(3000, () => {
//     console.log('Listening on port 3000');
// });

