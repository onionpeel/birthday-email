const {splitDate} = require('./splitDate');

//Defines a string property on the user object that converts a numeric format to a written format.  '2-7' => 'February 7'
let createAcknowledgementDate = function(user) {
  let dateArray = splitDate(user);
  let monthNumber = dateArray[1];
  let date = dateArray[2];
  const MonthNames = ["empty", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let month = MonthNames[monthNumber];
  return `${month} ${date}`;
};

module.exports = {createAcknowledgementDate}
