const range = (start, end, inclusive = false) => {
  const length = inclusive ? end - start + 1 : end - start;
  return Array.from({ length }, (_, i) => start + i);
};

export default range;
