const presentDay = new Date();
const presentYear = presentDay.getFullYear();
const presentMonth = presentDay.getMonth();

export const daysInMonth = (year = presentYear, month = presentMonth) => {
  return 32 - new Date(year, month, 32).getDate();
};
