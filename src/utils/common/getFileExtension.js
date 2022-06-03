const ext = function (fileName) {
  var result = fileName.split('.');
  return result.length === 1 ? '' : result.pop();
};

export default ext;
