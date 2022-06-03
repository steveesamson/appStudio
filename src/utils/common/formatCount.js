export const formatCount = (num) => {
  return num > 1000000 ? `${(num / 1000000).toFixed(1)}M` : num > 1000 ? `${(num / 1000).toFixed(1)}K` : num;
};
