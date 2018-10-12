const {dateToday} = require('./../../utilities/dateToday');
const {Birthday} = require('./../../models/birthday');

const bday = [{
  email: `learnjavascriptyes@gmail.com`,
  date: dateToday()
}];

const populateBday = done => {
  Birthday.deleteMany({}).then(() => {
    return Birthday.insertMany(bday);
  }).then(() => done());
};

module.exports = {bday, populateBday};
