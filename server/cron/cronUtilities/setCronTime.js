const isCronValid = require('./isCronValid');

//The input is a cron time.  The output is a cron time.  If no time is set or
//the the time is invalid, it will be set to 8:00 a.m. by default.  Otherwise,
//the input is returned.
function setCronTime(time = '* 8 * * *') {
  if(isCronValid(time)) {
    console.log(`A cron job has been set to execute at '${time}'`);
    return time;
  };
  console.log(`The time input, '${time}', for cron.schedule() was not valid.  By default, '* 8 * * *' will be used.`);
  return time = '* 8 * * *';
};

module.exports = setCronTime;
