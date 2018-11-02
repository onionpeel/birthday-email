const mongoose = require('mongoose');
// const validator = require('validator');
const {splitDate} = require('./../utility/splitDate');
const formattedDateArray = require('./../utility/formattedDateArray');
const {schemaObj} = require('./schemaObj');

let UserSchema = new mongoose.Schema(schemaObj);

//Defines a string property on the user object that has removed any zeroes that
//are the first digit.  '1993-03-09' => '1993-3-9'
UserSchema.methods.formatDate = function() {
  let user = this;
  let dateArray = splitDate(user);
  let noZeroPrefix = formattedDateArray(dateArray);
  let newDate = `${noZeroPrefix[0]}-${noZeroPrefix[1]}-${noZeroPrefix[2]}`;
  user.date = newDate;
};

let User = mongoose.model('User', UserSchema);


module.exports = {User, schemaObj};
