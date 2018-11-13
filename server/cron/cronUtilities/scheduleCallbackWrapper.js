const {dateToday} = require('./dateToday');
const {findBirthdaysSendEmail} = require('./../findAndSendBirthdays/findBirthdaysSendEmail');

/*
No input.  The output is the scheduleCallback() function.  scheduleCallback() is
used in cron.js to schedule a cron job. A wrapper has been created in order to
simplify the testing of the scheduleCallback() function so that it only has one
external dependency.  Otherwise, the function would be:
// let scheduleCallback = () => {
//   let today = dateToday();
//   findBirthdaysSendEmail(today);
// };
*/
let scheduleCallbackWrapper = () => {
  let today = dateToday();
  return function() {
    findBirthdaysSendEmail(today);
  };
};

let scheduleCallback = scheduleCallbackWrapper();

module.exports.scheduleCallback = scheduleCallback;
module.exports.scheduleCallbackWrapper = scheduleCallbackWrapper;
