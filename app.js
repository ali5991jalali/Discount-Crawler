// Required packages
const request = require('request')
const cheerio = require('cheerio')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Discounts', (error) => {
    if (error) console.log(`Error in connecting mongoDB bacause of ${error}`)
    else console.log('Connected to mongoDB successfuly')
})

// Crons
const { digikalaCron } = require('./crons/digikala');

// Excute functios
digikalaCron()
