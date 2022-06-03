const lpad = function (_number) {
  const num = _number + '';
  return num.length < 2 ? `0${num}` : num;
};

export default lpad;
