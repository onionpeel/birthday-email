const mongoose = require('mongoose');
const validator = require('validator');
const {splitDate} = require('./../utility/splitDate');
const {formattedDateArray} = require('./../utility/formattedDateArray');

let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 1,
    trim: true
  },
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    },
    minLength: 1,
    trim: true
  },
  date: {
    type: String,
    validate: {
      validator: function(value) {
        return /^\d{4}-\d{1,2}-\d{1,2}$/.test(value);
      },
      message: function(props) {return `${props.value} is not a valid birthdate`}
    },
    required: [true, 'Birthdate is required ']
  }
});

//Defines a string property on the user object that has removed any zeroes that are the first digit.  '1993-03-09' => '1993-3-9'
UserSchema.methods.formatDate = function() {
  let user = this;
  let dateArray = splitDate(user);
  let noZeroPrefix = formattedDateArray(dateArray);
  let newDate = `${noZeroPrefix[0]}-${noZeroPrefix[1]}-${noZeroPrefix[2]}`;
  user.date = newDate;
};

let User = mongoose.model('User', UserSchema);

module.exports = {User, splitDate};
