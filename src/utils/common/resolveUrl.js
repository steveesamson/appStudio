const resolveUrl = function (path) {
  let o = window.location.origin;
  // console.log("Origin: ", o)
  return path.startsWith('/') ? `${o}${path}` : `${o}/${path}`;
};

export default resolveUrl;
