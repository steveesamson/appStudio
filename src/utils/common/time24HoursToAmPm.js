
const time24HoursToAmPm = function (s) {
  let [hours, minutes, seconds] = s.split(':').map((e) => parseInt(e.trim(), 10));
  const ampm = hours > 12 ? 'PM' : 'AM';
  hours = hours > 12 ? hours % 12 : hours;
  return { hours, minutes, seconds, ampm };
};

export default time24HoursToAmPm;
