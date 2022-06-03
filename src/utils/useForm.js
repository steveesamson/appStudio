import { formStore } from './formStore';
import { useInput } from './useInput';

const isEmpty = function (o) {
  for (var key in o) {
    if (o.hasOwnProperty(key) && !!o[key]) return false;
  }
  return true;
};

export const useForm = (options) => {
  const { values, errors, graphs, dirty, silentErrors, isValid, ready, get } = formStore(options),
    formFields = {},
    listeners = {};

  const form = (node, attr) => {
    const inputTypes = [
      'textarea',
      'text',
      'password',
      'number',
      'email',
      'tel',
      'url',
      'search',
      'date',
      'datetime',
      'time',
      'month',
      'week',
      'select-one',
    ];
    let props = { ...attr };
    if (node.type && inputTypes.includes(node.type)) {
      props = { ...props, name: node.name, value: node.value };
    }
    props = { ...props, value: options[props.name] || '' };
    const propValue = (props.value || '').trim();
    values.update((v) => ({ ...v, [props.name]: propValue }));
    options[props.name] = propValue;

    const usi = useInput(props);

    const unsubscribe = usi.subscribe(({ state }) => {
      values.update((v) => ({ ...v, [state.name]: (state.value || '').trim() }));
      errors.update((e) => ({ ...e, [state.name]: state.error }));
      silentErrors.update((e) => ({ ...e, [state.name]: state.silentError }));
      graphs.update((g) => ({ ...g, [state.name]: state.graph }));
      isValid.set(isEmpty(get(errors)) && isEmpty(get(silentErrors)));
    });
    listeners[props.name] = unsubscribe;
    formFields[props.name] = usi;

    // console.log('type: ', node, node.type);

    if (node.type && inputTypes.includes(node.type)) {
      const onChange = (e) => {
        // console.log('onChange...');
        dirty.set(true);
        usi.setValue(node.value);
        validate(true);
      };
      const _event = node.type === 'select-one' ? 'change' : 'input';
      node.addEventListener(_event, onChange);
      return () => node.removeEventListener(_event, onChange);
    }
  };

  const removeAny = (docs, storeName) => {
    // console.log("Removing:", docs, storeName);
    // const store = useStore(`/${storeName}`);
    // store.unlink({ attachments: docs }, (er, msg) => {});
  };

  const removeDels = ({ delDocs, storeName }) => {
    removeAny(delDocs, storeName);
  };

  const removeNews = ({ newDocs, storeName }) => {
    removeAny(newDocs, storeName);
  };

  const reset = () => {
    ready.set(false);
    for (let k in options) {
      const next = formFields[k];
      if (next) {
        next.reset(options[k]);
      }
    }
    values.set(options || {});
    errors.set({});
    silentErrors.set({});
    graphs.set({});
    dirty.set(false);
    isValid.set(false);
    setTimeout(() => ready.set(true), 1000);
  };

  const onCancel = (fn) => {
    const handleCancel = (e) => {
      e.preventDefault();
      Object.values(formFields).forEach(({ state }) => {
        if (state.newDocs) removeNews(state);
      });
      Object.values(listeners).forEach((l) => l());
      fn && fn();
    };
    return handleCancel;
  };

  const validate = (skipError) => {
    Object.values(formFields).forEach((c) => c.validate(skipError));
  };

  const setValue = (name, val) => {
    dirty.set(true);
    formFields[name].setValue(val);
    validate(true);
  };

  const setDirectValue = (name, val) => {
    dirty.set(true);
    values.update((v) => ({ ...v, [name]: val }));
    validate(true);
  };
  const defaultValue = (name, val) => {
    formFields[name].setValue(val);
    validate(true);
  };
  const setObjectValue = (name, vob) => {
    // console.log('setObjectValue...');
    dirty.set(true);
    formFields[name].setObjectValue(vob);
    validate(true);
  };
  const setDelDocs = (name, doc) => {
    formFields[name].setDelDocs(doc);
    // validate(true);
  };
  const setNewDocs = (name, doc) => {
    formFields[name].setNewDocs(doc);
    // validate(true);
  };
  const setError = (name, error) => {
    errors.update((r) => ({ ...r, [name]: error }));
  };

  const onSubmit = (fn) => {
      const handleSubmit = (e) => {
        e.preventDefault();

        validate();
        if (!get(isValid)) return;

        Object.values(formFields).forEach(({ state }) => {
          if (state.delDocs) removeDels(state);
        });

        const result = Object.entries({ ...get(values) }).reduce((acc, [key, val]) => {
          if (val) {
            acc[key] = val;
          }
          return acc;
        }, {});
        fn(result);
      };
      return handleSubmit;
    },
    on = (fn) => {
      values.subscribe(fn);
    },
    unmount = (name) => {
      const unsubscribe = listeners[name];
      const field = formFields[name];
      if (unsubscribe && field) {
        clearError(name);
        unsubscribe();
        field.reset();
        delete listeners[name];
        delete formFields[name];
      }
    },
    clearError = (name) => {
      const ecopy = { ...get(errors) },
        scopy = { ...get(silentErrors) };
      delete ecopy[name];
      delete scopy[name];
      errors.set(ecopy);
      silentErrors.set(scopy);
    };

  return {
    form,
    setValue,
    setDirectValue,
    defaultValue,
    setDelDocs,
    setNewDocs,
    setObjectValue,
    validate,
    isValid,
    onSubmit,
    onCancel,
    errors,
    values,
    graphs,
    dirty,
    ready,
    reset,
    get,
    on,
    clearError,
    setError,
    unmount,
  };
};
