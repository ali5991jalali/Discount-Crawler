// Packages
const { CronJob } = require('cron');
// Functions
const { getAllDiscounts } = require('./../functions/digikala');
// Configs
const configs = require('./../configs/digikala');
// Main Function
function digikalaCron() {
    Object.keys(configs.categories).forEach((category) => {
        Object.keys(configs.categories[category]['categories']).forEach((subCategory) => {
            let link = configs['categories'][category]['categories'][subCategory]['link'];
            let enCategory = configs['categories'][category]['categories'][subCategory]['enCategory'];
            let faCategory = configs['categories'][category]['categories'][subCategory]['faCategory']
            getAllDiscounts(link, faCategory, enCategory)
                .then(response => {
                    console.log(response.data)
                })
        })
    })
}


// const job = new CronJob('* * 22 * * *', function () {
//     digikalaCron();
// }, null, true, 'Asia/Tehran');

module.exports = {
    digikalaCron
}

