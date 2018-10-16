const {dateToday} = require('./../../utilities/dateToday');
const {User} = require('./../../models/user');

const bday = [{
  email: `learnjavascriptyes@gmail.com`,
  date: dateToday()
}];

const populateBday = done => {
  User.deleteMany({}).then(() => {
    return User.insertMany(bday);
  }).then(() => done());
};

module.exports = {bday, populateBday};
