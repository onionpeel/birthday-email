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
  }
});

UserSchema.methods.formatDate = function() {
  let user = this;
  let date = user.date;
  let dateArray = date.split('-');

  let formattedDateArray = dateArray.map(value => {
    if (value.charAt(0) === "0") {
      let temp = value.slice(1);
      return temp;
    } else return value;
  });

  let newDate = `${formattedDateArray[1]}-${formattedDateArray[2]}`;
  user.date = newDate;
};

let User = mongoose.model('User', UserSchema);

module.exports = {User};
