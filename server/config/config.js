//This sets the environment variables based on whether the environment
//is set to production, development or test
let env = process.env.NODE_ENV || 'development';

if (env === 'test' || env === 'development') {
  let config = require('./config.json');
  let envConfig = config[env];

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
};
