import { useEvents } from './events';

const loading = useEvents('loading');
export const resolveAsyncAwait = (promise) => {
  return promise
    .then((res) => {
      loading.setTo(false);
      // if (!res.ok) {
      //   console.log('ok: ', res);
      //   return Promise.resolve({ error: res.statusText, status: res.status });
      // }

      return res
        .json()
        .then((data) => {
          const all = { ...data, status: res.status };

          if (all.error && all.error.indexOf('Duplicate') >= 0) {
            all.error = 'Duplicate data error';
          }
          return all;
        })
        .catch((error) => {
          loading.setTo(false);
          Promise.resolve({ error, status: res.status });
        });
    })
    .catch((e) => {
      loading.setTo(false);
      return Promise.resolve({ error: e, status: 500 });
    });
};
