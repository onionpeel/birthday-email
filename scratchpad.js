function formatDate (obj) {
  let user = obj;
  let date = user.date;
  let dateArray = date.split('-');

  let formattedDateArray = dateArray.map(value => {
    if (value.charAt(0) === "0") {
      let temp = value.slice(1);
      return temp;
    } else return value;
  });

  let newDate = `${formattedDateArray[1]}-${formattedDateArray[2]}`;
  return newDate;
};

let testObj = {
  date: '2233-11-16'
};
// formatDate(testObj)


console.log(formatDate(testObj))

let user = this;
let date = user.date;
let dateArray = date.split('-');

let formattedDateArray = dateArray.map(value => {
  if (value.charAt(0) === "0") {
    let temp = value.slice(1);
    return temp;
  } else return value;
});

let newDate = `${dateArray[1]}-${dateArray[2]}`
user.date = newDate;





function validation(value) {
  return /^\d{1,2}-\d{1,2}$/.test(value);
}

validation("2222-02-02")






let clipper = value => {
  if (value.charAt(0) === 0) {
    let temp = value.slice(1);
    return temp;
  } else return value;
}

console.log(clipper("05"))


let x = "04";
console.log(x.slice(1))


let date = `9-1`;
var regex2 = new RegExp('^\\d{4}-' + date);

let findBirthdays = (date) => {
  let dateRegex = new RegExp('^\\d{4}-' + date + '$');
  return dateRegex;
  // User.find({date})
  //     .then(users => {
  //       users.forEach(sendEmailCallback);
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
};
let dateRegex = findBirthdays(date)

let fullDate = '2011-9-01';
dateRegex.test(fullDate);


let err = {
  errors: {
    date: {
      message: "This is the date property"
    },
    email: {
      message: "this is the email property"
    }
  }
}

for (let prop in err.errors) {
  console.log(err.errors[prop].message)
}


// console.log('error: ', err.errors['date'].message)



let x = "";
console.log(x == false)
