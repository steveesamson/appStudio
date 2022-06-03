import { DAYS, MONTHS } from './daysMonths';

Object.assign(Date.prototype, {
  format(formatString) {
    const buffer = [],
      dateRE = /([a-zA-Z]+)?([^a-zA-Z])?/g,
      textRE = /([^`]*)?(`([^`]*)`)?([^`]*)?/gi,
      leadZeroes = (n) => {
        return n > 9 ? n : `0${n}`;
      },
      _ = {
        YY: ('' + this.getFullYear()).substring(2),
        YYYY: this.getFullYear(),
        M: this.getMonth() + 1,
        MM: leadZeroes(this.getMonth() + 1),
        MMM: ('' + MONTHS[this.getMonth()]).substring(0, 3),
        MMMM: MONTHS[this.getMonth()],
        D: this.getDate(),
        DD: leadZeroes(this.getDate()),
        DDD: DAYS[this.getDay()],
        Do: ('' + DAYS[this.getDay()]).substring(0, 3),
        H: this.getHours(),
        HH: leadZeroes(this.getHours()),
        m: this.getMinutes(),
        mm: leadZeroes(this.getMinutes()),
        s: this.getSeconds(),
        ss: leadZeroes(this.getSeconds()),
        Z: this.toString()
          .match(/(\([^)]+\))/)? this.toString()
          .match(/(\([^)]+\))/)[0]
          .replace('(', '')
          .replace(')', ''):'',
      };
    _.h = _.H > 12 ? _.H % 12 : _.H;
    _.hh = leadZeroes(_.h);
    _.am = _.H > 12 ? 'pm' : 'am';
    _.AM = _.H > 12 ? 'PM' : 'AM';

    const formateDate = (dateString) => {
      const sb = [];
      dateString.replace(dateRE, ($0, $1, $2) => {
        // console.log("$0:%s, $1:%s, $2:%s", $0, $1, $2)

        if ($1) {
          sb.push(_[$1]);
        }
        if ($2) {
          sb.push($2);
        }

        return;
      });

      return sb.join('');
    };

    formatString.replace(textRE, function ($0, $1, $2, $3, $4) {
      // console.log("$1:%s, $3:%s, $4:%s", $1, $3, $4)
      if ($1) {
        buffer.push(formateDate($1));
      }
      if ($3) {
        // console.log('$3: ', $3)
        buffer.push($3);
      }

      if ($4) {
        buffer.push(formateDate($4));
        // buffer.push($4);
      }

      return;
    });

    return buffer.join('');
  },
});
