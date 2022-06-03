import { writable, get as g } from 'svelte/store';

const eventMap = new Map();

export const useEvents = (type) => {
  // const exists = eventMap[type];
  // if (exists) return exists;
  if (eventMap.has(type)) return eventMap.get(type);

  const events = writable({ type });
  const exported = {
    is(value) {
      const { data } = g(events);
      return data === value;
    },
    value() {
      return { ...g(events) };
    },
    setTo(data) {
      events.set({ type, data });
    },
    clear() {
      events.set({ type });
    },
    error(err) {
      events.set({ type, error: err });
    },
    subscribe(fn) {
      return events.subscribe((_events) => {
        if (_events) {
          fn(_events);
        }
      });
    },
  };

  // eventMap[type] = exported;
  eventMap.set(type, exported);
  return exported;
};
