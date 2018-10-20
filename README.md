# Birthday-Email

Send yourself a birthday greeting by simply providing your name, email and birthdate.  

<img src="images/BirthdayEmail.PNG" width="100">

## Background
The project requires access to an email account from which the birthday messages are sent.  If Gmail is used, be sure to turn on the setting for "Allow less secure apps."  Gmail's security structure prevents it from being a good choice for production, but it will work for testing and development.

The cron job will work in development, but it may need to be adapted based on the production environment as there may be other ways of setting up scheduled events.

## Setup
For testing and development, a `config.json` file with account credentials needs to be created in the `config` directory.  To test whether the project is successfully sending emails, refer to the instructions in `testNodemailer.js`.

```
{
  "test": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/BirthdayEmailTest",
    "EMAILUSER": "...",
    "EMAILPASSWORD": "...",
    "TESTMAILUSER": "...",
    "TESTMAILPASSWORD": "..."
  },
  "development": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/BirthdayEmail",
    "EMAILUSER": "...",
    "EMAILPASSWORD": "...",
    "TESTMAILUSER": "...",
    "TESTMAILPASSWORD": "..."
  }
}
```

Instructions for production setup will be forthcoming.

## Hat tip
The code for the input form layout can be found at https://github.com/archer920/NodeIntroduction
