const mongoose = require('mongoose');

//The MONGODB_URI environment variable is set by: 1) the deployment platform in
//production or 2) the configurations in config.js for either the test or
//development environments.
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

module.exports = {mongoose};
