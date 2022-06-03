const varName = function (str) {
  str = str + '';
  return str ? str.replace(/\s+/g, '_').toLowerCase() : str;
};

export default varName;
