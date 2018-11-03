//The input is an array in which some values have a zero for the first digit.
//The return value is an array with those zeroes removed.
//['2006', '01', '06'] => ['2006', '1', '6']
//This function is invoked in user.js
let formattedDateArray = array => {
  return array.map(value => {
    if (value.charAt(0) === "0") {
      let temp = value.slice(1);
      return temp;
    } else return value;
  });
};

module.exports = {formattedDateArray};
