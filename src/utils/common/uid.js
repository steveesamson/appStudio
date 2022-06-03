const uid = function () {
  // return shortid.generate();
  return '_' + Math.random().toString(36).substr(2, 9);
};

export default uid;
