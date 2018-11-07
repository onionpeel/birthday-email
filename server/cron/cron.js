const cron = require('node-cron');
const {setCronTime} = require('./cronUtilities/setCronTime');
const {scheduleCallback} = require('./cronUtilities/scheduleCallbackWrapper');
/*
The "task" object stores a reference to when the cron job should be executed.
The task created in this module only becomes active with the task.start() command in server.js.
The scheduled task aquires today's date and uses it to invoke a callback
that finds matches in the User collection and send emails to those matches.
*/
let userCronTime = '29 10 * * *';
let validCronTime = setCronTime(userCronTime);

let task = cron.schedule(validCronTime, scheduleCallback);

module.exports = task;
