//Returns an array in which zero is removed if it is the first digit.  ['2006', '01', '06'] => ['2006', '1', '6']
let formattedDateArray = array => {
  return array.map(value => {
    if (value.charAt(0) === "0") {
      let temp = value.slice(1);
      return temp;
    } else return value;
  });
};

module.exports = {formattedDateArray};
