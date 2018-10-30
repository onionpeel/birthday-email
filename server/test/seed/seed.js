const dateToday = require('./../../cron/findAndSendBirthdays/dateToday');
const {User} = require('./../../models/user');

const bday = [{
  email: process.env.EMAILUSERNAME,
  date: dateToday()
}];

//This function wipes clean and then repopulates the collection used in testing
const populateBday = done => {
  User.deleteMany({}).then(() => {
    return User.insertMany(bday);
  }).then(() => done());
};

module.exports = {bday, populateBday};
