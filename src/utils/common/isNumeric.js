const isNumeric = function (n) {
  if (!n) {
    return false;
  }
  n = n.toString();
  if (n.startsWith('-') && n.length === 1) {
    n += '0';
  }
  if (n.endsWith('.')) {
    n += '0';
  }

  return n && n.toString().match(/^[-+]?[0-9]+(\.[0-9]+)?$/g);
};

export default isNumeric;
