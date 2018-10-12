const cron = require('node-cron');
const {findBirthdays} = require('./findandSendBirthdays/findBirthdays');
const {dateToday} = require('./../utilities/dateToday');

let task = cron.schedule('16 23 * * *', () => {
  console.log('cron test succeeded!')
  let today = dateToday();
  findBirthdays(today);
});

module.exports = {task};
