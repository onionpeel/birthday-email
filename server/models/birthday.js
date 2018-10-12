const mongoose = require('mongoose');

let BirthdaySchema = new mongoose.Schema({
  email: {
    type: String,
    minLength: 1,
    trim: true
  },
  date: {
    type: String,
    validate: {
      validator: function(value) {
        return /\d{1,2}\/\d{1,2}/.test(value);
      },
      message: function(props) {return `{props.value} is not a valid birthdate`}
    },
    required: [true, 'Birthdate is required ']
  }
});

let Birthday = mongoose.model('Birthday', BirthdaySchema);

module.exports = {Birthday};
