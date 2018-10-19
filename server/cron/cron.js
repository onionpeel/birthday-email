const cron = require('node-cron');
const {findBirthdays} = require('./findAndSendBirthdays/findBirthdays');
const {dateToday} = require('./findAndSendBirthdays/dateToday');

//The "task" object stores a reference to when the cron job should be executed.
//The scheduled task gets started in server.js with the task.start() command.
//The scheduled task is to aquire today's date and use it to invoke a function
//to find matches in the User collection and send emails to those matches.
let task = cron.schedule('11 16 * * *', () => {
  console.log('cron test succeeded!')
  let today = dateToday();
  findBirthdays(today);
});

module.exports = {task};
