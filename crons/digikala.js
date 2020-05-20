// Packages
const { CronJob } = require('cron');
// Functions
const { getAllDiscounts } = require('./../functions/digikala');
// Configs
const configs = require('./../configs/digikala');

const job = new CronJob('* * 22 * * *', function () {
    Object.keys(configs.categories).forEach((category) => {
        Object.keys(configs.categories[category]['categories']).forEach((subCategory) => {
            getAllDiscounts(configs['categories'][category]['categories'][subCategory]['link'])
                .then(`Ended category:${category} and subCategoey:${subCategory}`)
                .catch(`Error in category:${category} and subCatgory:${subCategory} because of ${error}`)
        })
    })
}, null, true, 'Asia/Tehran');

job.start()