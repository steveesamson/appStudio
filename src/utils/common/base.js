/* global Session */

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  strftime = function (date, sFormat) {
    if (!(date instanceof Date)) date = new Date();
    var nDay = date.getDay(),
      nDate = date.getDate(),
      nMonth = date.getMonth(),
      nYear = date.getFullYear(),
      nHour = date.getHours(),
      aDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      aMonths = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
      isLeapYear = function () {
        return (nYear % 4 === 0 && nYear % 100 !== 0) || nYear % 400 === 0;
      },
      getThursday = function () {
        var target = new Date(date);
        target.setDate(nDate - ((nDay + 6) % 7) + 3);
        return target;
      },
      zeroPad = function (nNum, nPad) {
        return (Math.pow(10, nPad) + nNum + '').slice(1);
      };
    return sFormat.replace(/%[a-z]/gi, function (sMatch) {
      return (
        ({
          '%a': aDays[nDay].slice(0, 3),
          '%A': aDays[nDay],
          '%b': aMonths[nMonth].slice(0, 3),
          '%B': aMonths[nMonth],
          '%c': date.toUTCString(),
          '%C': Math.floor(nYear / 100),
          '%d': zeroPad(nDate, 2),
          '%e': nDate,
          '%F': date.toISOString().slice(0, 10),
          '%G': getThursday().getFullYear(),
          '%g': (getThursday().getFullYear() + '').slice(2),
          '%H': zeroPad(nHour, 2),
          '%I': zeroPad(((nHour + 11) % 12) + 1, 2),
          '%j': zeroPad(aDayCount[nMonth] + nDate + (nMonth > 1 && isLeapYear() ? 1 : 0), 3),
          '%k': nHour,
          '%l': ((nHour + 11) % 12) + 1,
          '%m': zeroPad(nMonth + 1, 2),
          '%n': nMonth + 1,
          '%M': zeroPad(date.getMinutes(), 2),
          '%p': nHour < 12 ? 'AM' : 'PM',
          '%P': nHour < 12 ? 'am' : 'pm',
          '%s': Math.round(date.getTime() / 1000),
          '%S': zeroPad(date.getSeconds(), 2),
          '%u': nDay || 7,
          '%V': (function () {
            var target = getThursday(),
              n1stThu = target.valueOf();
            target.setMonth(0, 1);
            var nJan1 = target.getDay();
            if (nJan1 !== 4) target.setMonth(0, 1 + ((4 - nJan1 + 7) % 7));
            return zeroPad(1 + Math.ceil((n1stThu - target) / 604800000), 2);
          })(),
          '%w': nDay,
          '%x': date.toLocaleDateString(),
          '%X': date.toLocaleTimeString(),
          '%y': (nYear + '').slice(2),
          '%Y': nYear,
          '%z': date.toTimeString().replace(/.+GMT([+-]\d+).+/, '$1'),
          '%Z': date.toTimeString().replace(/.+\((.+?)\)$/, '$1'),
        }[sMatch] || '') + '' || sMatch
      );
    });
  };

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
          .match(/(\([^)]+\))/)[0]
          .replace('(', '')
          .replace(')', ''),
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

Object.assign(String.prototype, {
  endsWith(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  },
});

Object.assign(String.prototype, {
  startsWith(prefix) {
    return this.indexOf(prefix) === 0;
  },
});

Object.assign(String.prototype, {
  startsWithi(prefix) {
    return this.toLowerCase().indexOf(prefix.toLowerCase()) === 0;
  },
});

if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

let scrollTo = function (destination, duration = 200, easing = 'linear', callback) {
  const easings = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return --t * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart(t) {
      return 1 - --t * t * t * t;
    },
    easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint(t) {
      return 1 + --t * t * t * t * t;
    },
    easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    },
  };

  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
  );
  const windowHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.getElementsByTagName('body')[0].clientHeight;
  const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
  const destinationOffsetToScroll = Math.round(
    documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset,
  );

  if ('requestAnimationFrame' in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, (now - startTime) / duration);
    const timeFunction = easings[easing](time);
    window.scroll(0, Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start));

    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }

    requestAnimationFrame(scroll);
  }

  scroll();
};
let stringbuilder = function (initialString) {
    var content = [];
    initialString && content.push(initialString);

    return {
      append: function (text) {
        content.push(text);
        this.length = content.length;
        return this;
      },
      length: content.length,
      toString: function () {
        return content.join('');
      },
      clear: function () {
        content.splice(0, content.length);
        return this;
      },
    };
  },
  media = {
    fileTypes: 'pdf,doc,docx,xls,xlsx,csv,txt',
    imageTypes: 'png,tif,jpg,gif,jpeg,bmp',
    videoTypes: 'mp4,avi,flv,wmv,mov',
    audioTypes: 'mp3,wav,wma,ogg',
  },
  maskEmail = function (string) {
    var email_address,
      email_length,
      email_value,
      email_masked,
      i,
      email_print = '';

    email_address = string.split('@');

    email_length = email_address[0].length;

    email_value = email_length / 2;

    email_masked = email_length - email_value;

    for (i = 0; i < email_value; i++) {
      email_print += email_address[0][i];
    }

    for (i = 0; i < email_masked; i++) {
      email_print += '*';
    }
    return email_print + '@' + email_address[1];
  },
  template = function (tplString, data) {
    const RE = /([^{]*)?(\{(\w+)\})?([^{]*)?/gi;
    var sb = stringbuilder();

    tplString = tplString.trim().replace(/"/g, "'");
    tplString = tplString.replace(/[\n\r]/g, ' ');
    tplString = tplString.replace(/\s+/g, ' ');

    tplString.replace(RE, function ($0, $1, $2, $3, $4) {
      if ($1) {
        sb.append($1);
      }
      if ($3) {
        sb.append(data[$3]);
      }

      if ($4) {
        sb.append($4);
      }

      return;
    });

    return sb.toString();
  },
  xhrXport = function () {
    var xmlHttp = null;

    if (typeof XMLHttpRequest !== 'undefined') {
      xmlHttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      var ieXMLHttpVersions = [
        'MSXML2.XMLHttp.5.0',
        'MSXML2.XMLHttp.4.0',
        'MSXML2.XMLHttp.3.0',
        'MSXML2.XMLHttp',
        'Microsoft.XMLHttp',
      ];

      for (var i = 0; i < ieXMLHttpVersions.length; i++) {
        try {
          xmlHttp = new window.ActiveXObject(ieXMLHttpVersions[i]);
          if (xmlHttp) break;
        } catch (e) {}
      }
    }
    return xmlHttp;
  },
  Events = (function () {
    // addEvent/removeEvent written by Dean Edwards, 2005
    // with input from Tino Zijdel
    // http://dean.edwards.name/weblog/2005/10/add-event/

    var addEvent = function (element, type, handler) {
        if (element.addEventListener) {
          element.addEventListener(type, handler, false);
        } else {
          if (!handler.$$guid) handler.$$guid = addEvent.guid++;
          if (!element.events) element.events = {};
          var handlers = element.events[type];
          if (!handlers) {
            handlers = element.events[type] = {};
            if (element['on' + type]) {
              handlers[0] = element['on' + type];
            }
          }
          handlers[handler.$$guid] = handler;

          element['on' + type] = handleEvent.call(element);
        }
      },
      removeEvent = function (element, type, handler) {
        if (element.removeEventListener) {
          element.removeEventListener(type, handler, false);
        } else {
          if (type) {
            if (element.events && element.events[type]) {
              delete element.events[type][handler.$$guid];
            }
          }
        }
      },
      handleEvent = function () {
        var self = this;
        return function (event) {
          var returnValue = true;
          event = event || fixEvent(window.event);
          var handlers = this.events[event.type];
          for (var i in handlers) {
            this.$$handleEvent = handlers[i];
            if (this.$$handleEvent.call(self, event) === false) {
              returnValue = false;
            }
          }
          return returnValue;
        };
      },
      fixEvent = function (event) {
        event.preventDefault = fixEvent.preventDefault;
        event.stopPropagation = fixEvent.stopPropagation;
        return event;
      };
    addEvent.guid = 1;
    fixEvent.preventDefault = function () {
      this.returnValue = false;
    };
    fixEvent.stopPropagation = function () {
      this.cancelBubble = true;
    };

    return {
      addEvent: addEvent,
      removeEvent: removeEvent,
    };
  })(),
  ajax = function (options) {
    var xhr = xhrXport();
    if (!xhr) {
      return console.error('Unable to create XHR object.');
    }
    var fd = new FormData();

    fd.append(options.el.name, options.el.files[0]);

    if (options.data) {
      for (let k in options.data) {
        fd.append([k], options.data[k]);
      }
    }

    // if(Session && Session.isAuthenticated()){
    // 	// console.log('AJAX Authed!');
    // 	fd.append('x-csrf-token', Session.user().token);
    // }

    xhr.upload.addEventListener(
      'progress',
      function (evt) {
        if (evt.lengthComputable) {
          var percentComplete = parseInt((evt.loaded / evt.total) * 100, 10);
          options.onProgress(percentComplete);
        } else {
          console.error('Cannot compute progress...');
        }
      },
      false,
    );
    xhr.addEventListener('load', options.onComplete, false);
    xhr.addEventListener(
      'readystatechange',
      function (e) {
        let self = xhr;
        if (self.readyState === 4) {
          if (self.status === 200) {
            // console.log("Response: ", self.responseText)
            options.onSuccess(JSON.parse(self.responseText));
          } else {
            options.onFailed(self.responseText);
            // self.error.call(self, self.responseText);
          }
        }
      },
      false,
    );
    // xhr.addEventListener('error', polls.onFailed, false);
    // xhr.addEventListener('abort', polls.onCanceled, false);

    xhr.open('POST', options.url);
    xhr.send(fd);
  },
  isArray = Array.isArray,
  isString = function (o) {
    return typeof o === 'string';
  },
  isObject = function (o) {
    return !Array.isArray(o) && typeof o === 'object';
  },
  uid = function () {
    // return shortid.generate();
    return '_' + Math.random().toString(36).substr(2, 9);
  },
  isFunction = function (cb) {
    return typeof cb === 'function';
  },
  //   isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()),
  each = function (arrayOrObject, cb) {
    if (Array.isArray(arrayOrObject)) {
      for (var i = 0; i < arrayOrObject.length; ++i) {
        arrayOrObject[i] && cb && cb(i, arrayOrObject[i]);
      }
    } else if (isObject(arrayOrObject)) {
      for (var k in arrayOrObject) {
        cb && cb(k, arrayOrObject[k]);
      }
    }
  },
  ext = function (fileName) {
    var result = fileName.split('.');

    return result.length === 1 ? '' : result.pop();
  },
  baseName = function (path) {
    if (!path) return path;
    var lookfor = '';
    if (path.indexOf('\\') > -1) {
      lookfor = '\\';
    } else if (path.indexOf('/') > -1) {
      lookfor = '/';
    } else {
      return path;
    }
    var idx = path.lastIndexOf(lookfor);
    return path.substring(idx + 1);
  },
  isNumeric = function (n) {
    if (!n) {
      return false;
    }
    n = n.toString();
    if (n.startsWith('-') && n.length === 1) {
      n += '0';
    }
    if (n.endsWith('.')) {
      n += '0';
    }

    return n && n.toString().match(/^[-+]?[0-9]+(\.[0-9]+)?$/g);
  },
  isInteger = function (n) {
    return n && n.toString().match(/^[-+]?\d+$/g);
  },
  formatFields = function (map) {
    //console.log(map);
    var copy = {},
      valids = ['amount', 'rental', 'sum', 'charge', 'unit', 'price'];
    each(map, function (k, v) {
      copy[k] = v;

      for (var i = 0; i < valids.length; ++i) {
        if (k.indexOf(valids[i]) !== -1 && isNumeric(v)) {
          copy[k] = format(v);
          break;
        }
      }
    });

    return copy;
  },
  robaac = function (_roles) {
    //console.log('Extract: ', JSON.stringify(_roles));

    var roles = _roles || {},
      normalizeRoles = function () {
        var map = {};

        each(roles, function (role, def) {
          map[role] = {
            can: {},
            permissions: [],
          };

          if (def.inherits) {
            map[role].inherits = def.inherits;
          }

          each(def.can, function (i, operation) {
            if (isString(operation)) {
              map[role].permissions.push(operation);
              map[role].can[operation] = function () {
                return true;
              };
            } else if (isObject(operation)) {
              map[role].permissions.push(operation.name);
              map[role].can[operation.name] = new Function('param', 'return ' + operation.when + ';');
            }
          });
        });

        roles = map;
      };

    normalizeRoles();

    return {
      can: function (role, operation, options) {
        if (!roles[role]) return false;
        options = options || {};
        let decor = {};
        const { username, id, status } = Session.user();
        Object.assign(decor, { username: username, owner: id, owner_status: status });
        options && Object.assign(options, decor);

        var $role = roles[role];
        // console.log("Role: ", $role, " operation: ", operation, " options: ", options);

        // Check if this role has this operation
        if ($role.can[operation]) {
          // console.log('can', operation);
          // If the function check passes return true
          if ($role.can[operation](options)) {
            // console.log('can', operation, options);

            return true;
          }
        }

        // Check if there are any parents
        if (!$role.inherits || $role.inherits.length < 1) {
          return false;
        }

        var cans = 0;

        each($role.inherits, function (i, _role) {
          if (this.can(_role, operation, options)) {
            ++cans;
          }
        });

        return cans > 0;
        // Check child roles until one returns true or all return false
        //return $role.inherits.some(childRole => this.can(childRole, operation, polls));
      },
    };
  },
  format = function (amount) {
    var i = parseFloat(amount),
      delimitNumbers = function (str) {
        return (str + '').replace(/\b(\d+)((\.\d+)*)\b/g, function (a, b, c) {
          var num = (b.charAt(0) > 0 && !(c || '.').lastIndexOf('.') ? b.replace(/(\d)(?=(\d{3})+$)/g, '$1,') : b) + c;
          return num.endsWith('.00') ? num.substring(0, num.length - 3) : num;
        });
      };
    if (isNaN(i)) {
      i = 0.0;
    }
    var minus = '';
    if (i < 0) {
      minus = '-';
    }
    i = Math.abs(i);
    i = parseInt((i + 0.005) * 100, 10);
    i = i / 100;
    var s = String(i);
    if (s.indexOf('.') < 0) {
      s += '.00';
    }
    if (s.indexOf('.') === s.length - 2) {
      s += '0';
    }
    s = minus + s;

    return delimitNumbers(s);
  },
  varName = function (str) {
    str = str + '';
    return str ? str.replace(/\s+/g, '_').toLowerCase() : str;
  },
  makeName = function (str) {
    str = str + '';
    var index = str.indexOf('_');
    if (index < 0) {
      return str === 'id' ? str.toUpperCase() : str.charAt(0).toUpperCase() + str.substring(1);
    }
    let names = str.split('_');
    let new_name = '';

    names.forEach(function (s) {
      new_name += new_name.length > 0 ? ' ' + makeName(s) : makeName(s);
    });

    return new_name;
  },
  position = function (el) {
    return {
      left: el.offsetLeft,
      top: el.offsetTop,
    };
  },
  height = function (el) {
    if (el === document.body || el === document.documentElement) {
      const body = document.body;
      const html = document.documentElement;
      return Math.max(body.offsetHeight, body.scrollHeight, html.clientHeight, html.offsetHeight, html.scrollHeight);
    } else {
      return Math.max(el.getBoundingClientRect().height, el.clientHeight);
    }
  },
  width = function (el) {
    if (el === document.body || el === document.documentElement) {
      const body = document.body;
      const html = document.documentElement;

      return Math.max(body.offsetWidth, body.scrollWidth, html.clientWidth, html.offsetWidth, html.scrollWidth);
    } else {
      return Math.max(el.getBoundingClientRect().width, el.clientWidth);
    }
  },
  rect = function (el) {
    var box = {},
      rect = el.getBoundingClientRect();
    Object.assign(box, rect);
    box.height = this.height(el);
    box.width = this.width(el);

    return box;
  },
  offset = function (el) {
    var rect = el.getBoundingClientRect();

    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft,
    };
  },
  viewport = function () {
    var bx = {},
      rect = document.documentElement.getBoundingClientRect();
    Object.assign(bx, rect);
    bx.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    bx.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return bx;
  },
  toInt = function (nstr) {
    return parseInt(nstr, 10);
  },
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  lpad = function (_number) {
    _number = _number + '';
    return _number.length < 2 ? `0${_number}` : _number;
  },
  resolveUrl = function (path) {
    let o = window.location.origin;
    // console.log("Origin: ", o)
    return path.startsWith('/') ? `${o}${path}` : `${o}/${path}`;
  },
  debounce = function (func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  },
  isEmpty = function (o) {
    // return Object.keys(o).length === 0 && o.constructor === Object;
    return JSON.stringify(o) === '{}';
  },
  range = (start, end, inclusive = false) => {
    const length = inclusive ? end - start + 1 : end - start;
    return Array.from({ length }, (_, i) => start + i);
  },
  timeAmPmTo24Hours = function (s) {
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
  },
  time24HoursToAmPm = function (s) {
    let [hours, minutes, seconds] = s.split(':').map((e) => parseInt(e.trim(), 10));
    const ampm = hours > 12 ? 'PM' : 'AM';
    hours = hours > 12 ? hours % 12 : hours;
    return { hours, minutes, seconds, ampm };
  };
const bindInfiniteScroll = (el, cb) => {
  const onScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = el;
    // console.log('scroll...',scrollTop, clientHeight, scrollHeight)
    if (scrollHeight - Math.abs(scrollTop) === clientHeight) {
      cb && cb();
    }
  };
  el.addEventListener('scroll', onScroll);
  return () => el.removeEventListener('scroll', onScroll);
};

export const Common = {
  isArray: isArray,
  isObject: isObject,
  isEmpty: isEmpty,
  isString: isString,
  isFunction: isFunction,
  each: each,
  isNumeric: isNumeric,
  isInteger: isInteger,
  uid: uid,
  format: format,
  formatFields: formatFields,
  ext: ext,
  varName: varName,
  makeName: makeName,
  baseName: baseName,
  position: position,
  offset: offset,
  height: height,
  width: width,
  rect: rect,
  viewport: viewport,
  events: Events,
  upload: ajax,
  toInt: toInt,
  resolveUrl: resolveUrl,
  template: template,
  maskEmail: maskEmail,
  scrollTo: scrollTo,
  robaac: robaac,
  media: media,
  //   isMobile:isMobile,
  debounce: debounce,
  lpad: lpad,
  MONTHS: MONTHS,
  DAYS: DAYS,
  range,
  strftime,
  timeAmPmTo24Hours,
  time24HoursToAmPm,
  bindInfiniteScroll,
};

// export default Common;

// var dt = parseDate('December 06, 2017', 'F d, Y');
// console.log(formatDate(new Date(), 'yyyy-mm-dd'));
