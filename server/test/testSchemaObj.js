const validator = require('validator');

let testSchemaObj = {
  name: {
    type: String,
    minLength: 1,
    trim: true,
    required: [true, 'Your name is required']
  },
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: '\"{VALUE}\" is not a valid email'
    },
    minLength: 1,
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

module.exports = {testSchemaObj};
