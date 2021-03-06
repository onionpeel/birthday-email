const validator = require('validator');

//This schema is used in the definition of the "User" model
let schemaObj = {
  name: {
    type: String,
    minLength: 1,
    trim: true,
    required: [true, 'Your name is required']
  },
  email: {
    type: String,
    minLength: 1,
    validate: {
      validator: validator.isEmail,
      message: '\"{VALUE}\" is not a valid email'
    },
    trim: true,
    required: true
  },
  date: {
    type: String,
    minLength: 1,
    validate: {
      validator: function (value) {
        return validator.matches(value, /^\d{4}-\d{1,2}-\d{1,2}$/)
      },
      message: '\"{VALUE}\" is not a valid birthdate'
    },
    required: true
  }
};

module.exports = {schemaObj};
