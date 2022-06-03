import xhrXport from './xhr';

const ajax = function (options) {
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
};

export default ajax;
