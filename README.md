# Birthday-Email

Send yourself a birthday greeting by simply providing your name, email and birthdate.  

<img src="images/BirthdayEmail.PNG" width="500">

## Background
The project requires access to an email account from which the birthday messages are sent.  If Gmail is used, be sure to turn on the setting for "Allow less secure apps."  Gmail's security structure prevents it from being a good choice for production, but it will work for testing and development.

The cron job will work in development when run locally, but it may need to be adapted based on the production environment as there may be other ways of setting up scheduled events.

## Setup
For testing and development, a `config.json` file with email account credentials needs to be created in the `config` directory.  `EMAILUSER` AND `EMAILPASSWORD` are the variables pertaining to the email account used to send messages.  If using Gmail, the `SERVICE` variable is `gmail`.  
```
{
  "test": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/BirthdayEmailTest",
    "EMAILUSERNAME": "...",
    "EMAILPASSWORD": "...",
    "SERVICE": "..."
  },
  "development": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/BirthdayEmail",
    "EMAILUSERNAME": "...",
    "EMAILPASSWORD": "...",
    "SERVICE": "..."
  }
}
```

Instructions for production setup will be forthcoming.

## Installation
1. git clone https://github.com/onionpeel/birthday-email.git
2. cd birthday-email
3. npm install
4. In `server/config` create a file, `config.json`.
Inside of `config.json` copy and paste the config object shown above in the Setup.  Fill out the credentials for the email account that will be used to send the birthday messages (`EMAILUSERNAME`, `EMAILPASSWORD`).    
5. Run MongoDB locally on your machine.  A new database and collection will be generated automatically the first time a user is created.
6.  Schedule a cron job in `server/cron/cron.js` by setting `userCronTime` to a cron string value.  For example, the following will run everyday at 4:15 p.m.  
```
'15 16 * * *'
```
If no value is set, the default time will 8:00 a.m.
7.  Make sure all the changes are saved and execute the program:  `node server/server.js`.
8.  Go to `localhost:3000` and fill out the form.  If you want to see it work without waiting until your next birthday, set the birthdate to today's date and go back into `server/cron/cron.js` to schedule the cron job to run a few minutes after you execute `node server/server.js`.

## Notes
The goal of this project was to learn fullstack development by creating a birthday email application.  I

The project could be built out further to tackle other issues such as leap year birthdays, validation of cron.schedule() inputs, duplicate email accounts and enabling users to revise their submission or prevent an email from being sent.

## Hat tip
The code for the input form layout can be found at https://github.com/archer920/NodeIntroduction

The function, `isCronValid()` is available at https://stackoverflow.com/questions/52189713/regular-expression-for-cron-expression-in-javascript
