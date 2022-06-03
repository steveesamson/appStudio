const isEmpty = function (o) {
  // return Object.keys(o).length === 0 && o.constructor === Object;
  return JSON.stringify(o) === '{}';
};

export default isEmpty;
