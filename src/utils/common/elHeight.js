const height = function (el) {
  if (el === document.body || el === document.documentElement) {
    const body = document.body;
    const html = document.documentElement;
    return Math.max(body.offsetHeight, body.scrollHeight, html.clientHeight, html.offsetHeight, html.scrollHeight);
  } else {
    return Math.max(el.getBoundingClientRect().height, el.clientHeight);
  }
};

export default height;
