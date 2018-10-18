//Returns an array with elements [month, date] based on the user.date string property
let splitDate = function (userObject) {
  let date = userObject.date;
  let dateArray = date.split('-');
  return dateArray;
};

module.exports = {splitDate};
