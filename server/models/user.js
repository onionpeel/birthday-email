const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 1,
    trim: true
  },
  email: {
    type: String,
    minLength: 1,
    trim: true
  },
  date: {
    type: String,
    validate: {
      validator: function(value) {
        return /^\d{1,2}-\d{1,2}$/.test(value);
      },
      message: function(props) {return `${props.value} is not a valid birthdate`}
    },
    required: [true, 'Birthdate is required ']
  },
  acknowledgementDate: {
    type: String,
    required: true
  }
});

//Returns an array with elements [month, date] based on the user.date string property
let splitDate = function (userObject) {
  let date = userObject.date;
  let dateArray = date.split('-');
  return dateArray;
};

//Returns an array in which zero is removed if it is the first digit.  ['01', '06'] => ['1', '6']
let formattedDateArray = array => {
  return array.map(value => {
    if (value.charAt(0) === "0") {
      let temp = value.slice(1);
      return temp;
    } else return value;
  });
};

//Defines a string property on the user object that has removed any zeroes that are the first digit.  '03-09' => '3-9'
UserSchema.methods.formatDate = function() {
  let user = this;
  let dateArray = splitDate(user);
  let noZeroPrefix = formattedDateArray(dateArray);
  let newDate = `${noZeroPrefix[1]}-${noZeroPrefix[2]}`;
  user.date = newDate;
};

//Defines a string property on the user object that converts a numeric format to a written format.  '2-7' => 'February 7'
UserSchema.methods.createAcknowledgementDate = function() {
  let user = this;
  let dateArray = splitDate(user);
  let monthNumber = dateArray[0];
  let date = dateArray[1];
  const MonthNames = ["empty", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let month = MonthNames[monthNumber];
  user.acknowledgementDate = `${month} ${date}`;
};

let User = mongoose.model('User', UserSchema);

module.exports = {User};
