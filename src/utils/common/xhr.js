const xhrXport = function () {
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
};

export default xhrXport;
