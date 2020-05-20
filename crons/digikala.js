// Packages
const { CronJob } = require('cron');
// Functions
const { getAllDiscounts } = require('./../functions/digikala');
// Configs
const configs = require('./../configs/config');

const job = new CronJob('* * * * * *', function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

job.start()