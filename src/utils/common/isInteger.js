const isInteger = function (n) {
  return n && n.toString().match(/^[-+]?\d+$/g);
};

export default isInteger;
