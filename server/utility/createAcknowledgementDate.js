const {splitDate} = require('./splitDate');

//The input is a user object, which has a date property.  That property is used
//to return a string that holds the conversion of a numeric format to a written
//format.  '2-7' => 'February 7'.
//The return value is rendered in acknowledgement.handlebars.
let createAcknowledgementDate = function(user) {
  let dateArray = splitDate(user);
  let monthNumber = dateArray[1];
  let date = dateArray[2];
  const MonthNames = ["empty", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let month = MonthNames[monthNumber];
  return `${month} ${date}`;
};

module.exports = {createAcknowledgementDate}
