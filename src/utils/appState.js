import { writable, derived } from 'svelte/store';
import { useStore } from 'utils/store';
import { localStore } from 'utils/clientStore';
import { withRole } from 'utils/common/circleRoles';
import { logout } from 'utils/session';

const clearRequests = {};
const subscriptions = [];

const isEmptyObject = (obj) => {
  return JSON.stringify(obj) === '{}';
};

export const subscribeEvent = (cb) => subscriptions.push(cb);
export const state = writable({});

export const privates = derived(state, ($state) => {
  return ($state.privates || []).length;
});
export const changesOn = (circleId) =>
  derived(state, ($state) => {
    const { tots, articles, tasks, usertasks, reqs } = $state[circleId] || {};
    return {
      usertasks: (usertasks || []).length,
      tasks: (tasks || []).length,
      articles: (articles || []).length,
      reqs: (reqs || []).length,
      tots: (tots || []).length,
    };
  });
export const isChanged = (circleId) =>
  derived(changesOn(circleId), ($changesOn) => {
    const { tots, articles, tasks, usertasks, reqs } = $changesOn;
    return { usertasks: usertasks > 0, tasks: tasks > 0, articles: articles > 0, reqs: reqs > 0, tots: tots > 0 };
  });

export const isClean = (circleId) =>
  derived(isChanged(circleId), ($isChanged) => {
    const { tots, articles, tasks, usertasks, reqs } = $isChanged;
    return !usertasks && !tasks && !articles && !reqs && !tots;
  });
export const hasNotification = derived(state, ($state) => {
  return Object.keys($state).filter((e) => e !== 'privates').length > 0;
});
export const changes = derived(state, ($state) => {
  return Object.keys($state).filter((e) => e !== 'privates');
});
export const getStateFor = (circleId, store) =>
  derived(state, ($state) => {
    return ($state[circleId] || {})[store] || [];
  });

export const initState = (streamId) => {
  if (!streamId) {
    return window.location.replace('/'); //goto('/',{replaceState:true});
  }
  const key = `${streamId}-notifications`;
  const storedState = localStore.get(key);
  if (storedState) {
    state.set(storedState);
  }

  const onCreate = (store, data) => {
    // console.log(`onCreate: ${store} - `, data);
    const { createdBy, streamId: owner, id, visibility, refId, type } = data;
    if (createdBy === streamId) return;

    switch (store) {
      case 'articles':
        if (!id || !visibility) return;
        state.update((s) => {
          const circle = s[visibility] || {};
          const articles = circle['articles'] || [];
          articles.push(id);
          circle['articles'] = [...new Set(articles)];
          s[visibility] = circle;

          return s;
        });
        break;

      case 'usertasks':
        if (owner !== streamId) return;
        if (!id || !visibility) return;
        state.update((s) => {
          const circle = s[visibility] || {};
          const utasks = circle['usertasks'] || [];
          utasks.push(id);
          circle.usertasks = [...new Set(utasks)];
          s[visibility] = circle;
          return s;
        });
        break;

      case 'tots':
        if (!id || !visibility) return;
        state.update((s) => {
          const circle = s[visibility] || {};
          const tots = circle['tots'] || [];
          tots.push(id);
          circle.tots = [...new Set(tots)];
          s[visibility] = circle;
          return s;
        });

        break;
      case 'requests':
        if (!refId || !type) return;
        if (type !== 'circle') return;
        state.update((s) => {
          const circle = s[refId] || {};
          const reqs = circle['reqs'] || [];
          reqs.push(id);
          circle.reqs = [...new Set(reqs)];
          s[refId] = circle;
          return s;
        });
        break;
    }
  };

  const onUserTaskUpdate = (data) => {
    const { updatedBy, streamId: owner } = data;
    if (updatedBy === streamId) return;
    if (owner !== streamId) return;
    // console.log('onUserTaskUpdate:', data);

    state.update((s) => {
      const { id, visibility } = data;
      const circle = s[visibility] || {};
      const utasks = circle['usertasks'] || [];
      utasks.push(id);
      circle.usertasks = [...new Set(utasks)];
      s[visibility] = circle;
      return s;
    });
  };

  const onUpdateTasks = ({ id, title, visibility, updatedBy }) => {
    if (updatedBy === streamId) return;
    state.update((s) => {
      const circle = s[visibility] || {};
      const tasks = circle['tasks'] || [];
      tasks.push(id);
      circle.tasks = [...new Set(tasks)];
      s[visibility] = circle;
      return s;
    });
  };

  const watchColaboCircle = async (visibility, role) => {
    // console.log('watchColaboCircle:', visibility, role);
    const userTaskStore = useStore('usertasks', { visibility });
    await userTaskStore.sync([]);

    const totStore = useStore('usertots', { visibility });
    await totStore.sync([]);

    const articleStore = useStore('articles', { visibility });
    await articleStore.sync([]);

    const exitArticleCreate = articleStore.on('create', (data) => onCreate('articles', data));
    const exitUserTaskCreate = userTaskStore.on('create', (data) => onCreate('usertasks', data));
    const exitTotCreate = totStore.on('create', (data) => onCreate('tots', data));
    const exitUserTaskUpdate = userTaskStore.on('update', onUserTaskUpdate);
    subscriptions.push(exitUserTaskCreate, exitUserTaskUpdate, exitTotCreate, exitArticleCreate);

    const can = withRole(role);
    if (can('create-task')) {
      const tasksStore = useStore('tasks', { visibility }, 'desc');
      await tasksStore.sync();
      const exitUpdateTask = tasksStore.on('update', onUpdateTasks);
      subscriptions.push(exitUpdateTask);
    }

    if (can('add-member')) {
      const requests = useStore('requests', { refId: visibility });
      await requests.sync([]);
      const exitReqCreate = requests.on('create', (data) => onCreate('requests', data));
      subscriptions.push(exitReqCreate);
    }
  };

  const start = async () => {
    const privatetots = useStore('usertots', { visibility: 'private' }, 'desc');
    await privatetots.sync([]);
    const exitPrivatetots = privatetots.on('create', ({ createdBy, streamId: owner, id }) => {
      if (createdBy === streamId) return;
      if (owner !== streamId) return;
      state.update((s) => {
        const _privates = s.privates || [];
        _privates.push(id);
        s.privates = [...new Set(_privates)];
        return s;
      });
    });
    subscribeEvent(exitPrivatetots);

    const userCircles = useStore('usercircles', { streamId, active: true });
    await userCircles.sync();
    const roleMap = {};
    const exitUserCircles = userCircles.on('create', (ucircle) => {
      const { circleId: visibility, role, type } = ucircle;
      if (type === 'colab') {
        // roleMap[visibility] = role;
        watchColaboCircle(visibility, role);
      }
    });
    subscriptions.push(exitUserCircles);

    // const exitUpdateUserCircles = userCircles.on('update', (data) => {
    //   const { circleId: visibility, updatedBy, streamId: Owner, role } = data;
    //   if (streamId === updatedBy) return;
    //   // if (streamId === Owner) {
    //   //   const oldRole = roleMap[visibility];
    //   //   if (oldRole && oldRole !== role) {
    //   //     return logout();
    //   //   }
    //   // }

    //   state.update((s) => {
    //     const circle = s[visibility] || {};
    //     s[visibility] = circle;
    //     return s;
    //   });
    // });
    // subscriptions.push(exitUpdateUserCircles);

    const { data: circles } = userCircles.value();

    for (let { circleId: visibility, role, type } of circles) {
      // if (type === 'colab' || (type === 'admin' && role === 'admin')) {
      if (type === 'colab') {
        watchColaboCircle(visibility, role);
      }
    }
    state.subscribe((value) => localStore.set(key, value));
  };

  start();
};

export const clearPrivates = () => {
  const combinedKey = `private::tots`;
  if (clearRequests[combinedKey]) return;

  const next = setTimeout(() => {
    state.update((s) => {
      s.privates = 0;
      return s;
    });

    delete clearRequests[combinedKey];
  }, 10000);

  clearRequests[combinedKey] = next;
};
export const clear = (key, circleId) => {
  const combinedKey = `${circleId}::${key}`;
  if (clearRequests[combinedKey]) return;
  const interval = key === 'tots' ? 10000 : 5000;

  const next = setTimeout(() => {
    state.update((s) => {
      const circle = s[circleId];
      if (circle) {
        delete circle[key];
        if (isEmptyObject(circle)) {
          delete s[circleId];
        } else {
          s[circleId] = circle;
        }
      }
      return s;
    });

    delete clearRequests[combinedKey];
  }, interval);

  clearRequests[combinedKey] = next;
};
export const clearCircle = (circleId) => {
  state.update((s) => {
    const circle = s[circleId];
    if (circle) {
      if (isEmptyObject(circle)) {
        delete s[circleId];
      }
    }
    return s;
  });
};
export const clearItem = (storeName, circleId, id) => {
  if (!circleId) return;
  state.update((s) => {
    const circle = s[circleId];
    if (circle) {
      const store = circle[storeName];
      if (store) {
        const left = store.filter((l) => l !== id);
        circle[storeName] = left;
        if (!left.length) {
          delete circle[storeName];
        }
      }
      if (isEmptyObject(circle)) {
        delete s[circleId];
      } else {
        s[circleId] = circle;
      }
    }
    return s;
  });
};

export const exit = () => {
  subscriptions.forEach((h) => h());
};
