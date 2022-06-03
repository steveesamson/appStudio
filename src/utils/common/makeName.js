const makeName = function (str) {
  str = str + '';
  var index = str.indexOf('_');
  if (index < 0) {
    return str === 'id' ? str.toUpperCase() : str.charAt(0).toUpperCase() + str.substring(1);
  }
  let names = str.split('_');
  let new_name = '';

  names.forEach(function (s) {
    new_name += new_name.length > 0 ? ' ' + makeName(s) : makeName(s);
  });

  return new_name;
};

export default makeName;
