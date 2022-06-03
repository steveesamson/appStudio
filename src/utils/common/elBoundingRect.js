import elHeight from "./elHeight";
import elWidth from "./elWidth";

const rect = function (el) {
  if(!el) return;
  let box = {},
  rect = el.getBoundingClientRect();
  Object.assign(box, rect);
  box.height = elHeight(el);
  box.width = elWidth(el);

  return box;
};
export default rect;
