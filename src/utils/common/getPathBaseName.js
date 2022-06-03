const baseName = function (path) {
  if (!path) return path;
  var lookfor = '';
  if (path.indexOf('\\') > -1) {
    lookfor = '\\';
  } else if (path.indexOf('/') > -1) {
    lookfor = '/';
  } else {
    return path;
  }
  var idx = path.lastIndexOf(lookfor);
  return path.substring(idx + 1);
};

export default baseName;
