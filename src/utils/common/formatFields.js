import format from './formatCurrency';
import isNumeric from './isNumeric';

const formatFields = function (map, valids = ['amount', 'sum', 'charge', 'unit', 'price']) {
  var copy = {};
  for (let [k, v] of Object.entries(map)) {
    copy[k] = v;
    for (let valid of valids) {
      if (k.indexOf(valid) !== -1 && isNumeric(v)) {
        copy[k] = format(v);
        break;
      }
    }
  }

  return copy;
};

export default formatFields;
