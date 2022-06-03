const width = function (el) {
  if (el === document.body || el === document.documentElement) {
    const body = document.body;
    const html = document.documentElement;

    return Math.max(body.offsetWidth, body.scrollWidth, html.clientWidth, html.offsetWidth, html.scrollWidth);
  } else {
    return Math.max(el.getBoundingClientRect().width, el.clientWidth);
  }
};

export default width;
