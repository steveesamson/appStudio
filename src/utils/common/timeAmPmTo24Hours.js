const timeAmPmTo24Hours = (s) => {
  /*
   * Write your code here.
   */
  if (s.endsWith('PM')) {
    let ss = s
      .replace('PM', '')
      .split(':')
      .map((e) => parseInt(e.trim(), 10));
    ss[0] = (ss[0] % 12) + 12; //h === 12 ? h : h + 12;
    s = ss.join(':');
  } else if (s.endsWith('AM')) {
    let ss = s
      .replace('AM', '')
      .split(':')
      .map((e) => parseInt(e.trim(), 10));
    ss[0] = ss[0] % 12; //h === 12 ? 0 : h;
    s = ss.join(':');
  }
  return s
    .split(':')
    .map((e) => ((e + '').length < 2 ? '0' + e : e))
    .join(':');
};

export default timeAmPmTo24Hours;
