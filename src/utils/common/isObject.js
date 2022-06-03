const isObject = function (o) {
  return !Array.isArray(o) && typeof o === 'object';
};

export default isObject;
