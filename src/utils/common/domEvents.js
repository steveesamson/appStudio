const Events = (function () {
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
})();

export default Events;
