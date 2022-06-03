const onMouseDownOutside = (el,cb) =>{
    const onMouseDown = e =>{
      if(!el) return;
      if(!el.isSameNode(e.target) && !el.contains(e.target)){
         cb && cb();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
}
export default onMouseDownOutside;