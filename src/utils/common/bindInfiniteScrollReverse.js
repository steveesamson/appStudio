const bindInfiniteScroll = (el, cb, threshold = 0) => {
  const onScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = el;

    if (scrollTop <= threshold) {
      cb && cb();
    }
  };
  el.addEventListener('scroll', onScroll);
  return () => el.removeEventListener('scroll', onScroll);
};

export default bindInfiniteScroll;
