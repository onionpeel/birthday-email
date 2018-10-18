const cron = require('node-cron');
const {findBirthdays} = require('./findAndSendBirthdays/findBirthdays');
const {dateToday} = require('./findAndSendBirthdays/dateToday');

let task = cron.schedule('11 16 * * *', () => {
  console.log('cron test succeeded!')
  let today = dateToday();
  findBirthdays(today);
});

module.exports = {task};
