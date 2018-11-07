const {User} = require('./../models/user');
const {mongoose} = require('./../db/mongoose');
const {createAcknowledgementDate} = require('./../utility/createAcknowledgementDate');

let saveUser = async (req, res) => {
  let user = new User({
    email: req.body.email,
    date: req.body.date,
    name: req.body.first_name
  });

  //Remove any preceding zeroes in the date
  user.formatDate();

  try {
    let userObject = await user.save();
    // //After being saved to the database, prepare the user object to be rendered.
    userObject.date = createAcknowledgementDate(user);
    userObject.title = 'Birthday Email';
    return userObject;
  }catch(err) {
    return err;
  }
};

module.exports = {saveUser};
