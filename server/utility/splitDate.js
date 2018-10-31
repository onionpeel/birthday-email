//The input is a "user" object.  The date property on this object is converted
//from a string to an array using a hyphen as a separator.  This array is
//the return value.
//It is invoked in user.js and createAcknowledgementDate.js
let splitDate = function (userObject) {
  let date = userObject.date;
  let dateArray = date.split('-');
  return dateArray;
};

module.exports = {splitDate};
