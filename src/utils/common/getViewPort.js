const viewport = function () {
  let bx = {},
    rect = document.documentElement.getBoundingClientRect();
  Object.assign(bx, rect);
  bx.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  bx.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return bx;
};

export default viewport;
