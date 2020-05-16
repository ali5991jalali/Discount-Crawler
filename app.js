// Required packages
const request = require('request')
const cheerio = require('cheerio')
// Functions
const { getAllDiscounts } = require('./functions/digikala');

getAllDiscounts('https://www.digikala.com/search/category-mobile-phone')
    .then(data => {
        console.log('last dataaa', data)
    })