const format = (amount) => {
  let i = parseFloat(amount);
  const delimitNumbers = (str) => {
    return (str + '').replace(/\b(\d+)((\.\d+)*)\b/g, function (a, b, c) {
      var num = (b.charAt(0) > 0 && !(c || '.').lastIndexOf('.') ? b.replace(/(\d)(?=(\d{3})+$)/g, '$1,') : b) + c;
      return num.endsWith('.00') ? num.substring(0, num.length - 3) : num;
    });
  };
  if (isNaN(i)) {
    i = 0.0;
  }
  var minus = '';
  if (i < 0) {
    minus = '-';
  }
  i = Math.abs(i);
  i = parseInt((i + 0.005) * 100, 10);
  i = i / 100;
  var s = String(i);
  if (s.indexOf('.') < 0) {
    s += '.00';
  }
  if (s.indexOf('.') === s.length - 2) {
    s += '0';
  }
  s = minus + s;

  return delimitNumbers(s);
};

export default format;
