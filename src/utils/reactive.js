let attachEvent = function (evt, handler, context) {
    handler['context'] = context;
    if (!this[evt]) {
      this[evt] = [];
    }
    this[evt].push(handler);
  },
  detachEvent = function (evt, handler) {
    let i = this[evt].indexOf(handler);
    if (i !== -1) this[evt].splice(i, 1);
  };

function Reactive(attr) {
  let finalizer = {
    events: {},
    fireEvent: function (evt, data) {
      let cntx = null;
      if (this.events[evt]) {
        for (let v of this.events[evt]) {
          cntx = v['context'];
          data ? v.call(cntx, data) : v.call(cntx);
        }
      }
    },

    on: function (event, handler, context) {
      const nextHandler = (data) => {
        handler(data);
      };

      attachEvent.call(this.events, event.trim(), nextHandler, context);

      return () => this.unsubscribe(nextHandler, event.trim());
    },

    unsubscribe: function (subscriber, evt) {
      detachEvent.call(this.events, evt, subscriber);
    },
    subscribe: function (subscriber, interest) {
      if (subscriber && typeof subscriber === 'function') {
        const nextHandler = () => {
          if (interest) subscriber(this[interest]);
          else subscriber(this);
        };

        this.on('change', nextHandler);

        return () => this.unsubscribe(nextHandler, 'change');
      } else {
        throw Error('subscriber can only be a function...');
      }
    },
  };
  Object.assign(attr, finalizer);
}

export const makeReactive = function (target) {
  // console.log(target)
  Reactive(target);
};
