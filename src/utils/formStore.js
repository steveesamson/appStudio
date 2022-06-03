import { writable, get } from 'svelte/store';

export const formStore = (props) => {
  const ready = writable(false),
    values = writable(props || {}),
    errors = writable({}),
    silentErrors = writable({}),
    graphs = writable({}),
    isValid = writable(false),
    dirty = writable(false);
  setTimeout(() => ready.set(true), 1000);
  return {
    values,
    errors,
    silentErrors,
    graphs,
    isValid,
    dirty,
    ready,
    get,
  };
};
