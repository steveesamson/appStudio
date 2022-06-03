import { writable, get as g } from 'svelte/store';
import { Transport } from 'utils/Transport';
import { cookieStore } from 'utils/clientStore';
import debounce from 'utils/common/debounce';
import makeName from 'utils/common/makeName';

const getStore = (
	name,
	params = {},
	order = 'asc',
	orderby,
	result,
	resultKey,
	namespace,
	reverse = false
) => {
	let offset = 0,
		query = {},
		searchTerm = '',
		insync = false,
		infinite = false,
		page = 1;

	const store = name,
		listeners = {},
		limit = 25, //25
		url = `/${name}`,
		reset = () => {
			page = 1;
			offset = 0;
			insync = false;
			params = {};
			query = {};
			result.set({ data: [], recordCount: 0, pages: 0, page, status: 'idle' });
		},
		setStatus = (status) => {
			result.update((all) => ({ ...all, status }));
		},
		search = (s) =>
			debounce(() => {
				insync = false;
				offset = 0;
				page = 1;
				///Watch the above in case of endless ...
				searchTerm = s;
				sync();
			}, 500)(),
		filter = (q) => {
			insync = false;
			offset = 0;
			page = 1;
			query = q;
			sync();
		},
		paginate = (_offset) => {
			if (+_offset + 1 === page) return;
			offset = +_offset * limit;
			page = +_offset + 1;
			insync = false;
			sync();
		},
		next = () => {
			if (!insync) return;
			const { recordCount, status } = g(result);
			if (offset + limit > recordCount) {
				return; // console.log(`No fetch, returning: ${resultKey} `);
			}
			if (status !== 'done') return;

			offset += limit;
			insync = false;
			infinite = true;
			sync();
		},
		prepQuery = () => {
			let q = { ...params, limit, offset, ...query, direction: order };
			if (orderby) {
				q.orderby = orderby;
			}
			if ('limit' in params && !params.limit) {
				delete q.limit;
			}

			if (searchTerm) {
				q = { ...q, search: searchTerm };
			}
			query = {};
			return q;
		},
		mutateMany = (dataIn) => {
			const withSorter = (a, b) => b.id - a.id;
			const { recordCount, data } = dataIn;
			// console.log('default: ', data);
			// console.log('reverse: ', data.reverse());
			result.update(({ data: oldData }) => {
				// const newData = infinite ? (order === 'asc' ? [...oldData, ...data] : [...data, ...oldData]) : data;
				if (reverse) {
					data.reverse();
				}
				const newData = infinite ? (reverse ? [...data, ...oldData] : [...oldData, ...data]) : data;
				const pages = recordCount ? Math.ceil(recordCount / limit) : 0;
				return { data: newData, recordCount, page, pages, status: 'done' };
			});
			insync = true;
		},
		mutateRemove = async (inData) => {
			if (!insync) {
				return;
			}

			const exists = await find(inData.id);
			if (exists) {
				result.update(({ data: oldData, recordCount: oldRecordCount, status }) => {
					const recordCount = oldRecordCount - 1;
					const data = oldData.filter((e) => e.id != inData.id);
					const pages = recordCount ? Math.ceil(recordCount / limit) : 0;
					return {
						page,
						data,
						recordCount,
						pages,
						status
					};
				});
			}
		},
		mutateAdd = async (inData) => {
			if (!insync) {
				return;
			}
			const exists = await find(inData.id);
			if (exists) {
				return;
			}
			inData = { ...inData, isNew: true };
			result.update(({ data: oldData, recordCount: oldRecordCount, status }) => {
				const data = reverse
					? [...oldData, inData]
					: order === 'asc'
					? [...oldData, inData]
					: [inData, ...oldData];
				const recordCount = oldRecordCount + 1;
				const pages = recordCount ? Math.ceil(recordCount / limit) : 0;
				return { data, recordCount, page, pages, status };
			});
		},
		mutatePatch = (inData) => {
			if (!insync) {
				return;
			}
			result.update(({ data: oldData, ...rest }) => {
				// const data = oldData.map((rec) => (rec.id == inData.id ? { ...rec, ...inData } : rec));
				const data = oldData.map((rec) => (rec.id == inData.id ? inData : rec));
				return {
					...rest,
					data
				};
			});
		},
		value = () => {
			return g(result);
		},
		sync = async (initData) => {
			if (initData) {
				setStatus('fetching');
				const data = Array.isArray(initData) ? [...initData] : [{ ...initData }];
				return mutateMany({ data, recordCount: data.length });
			}

			if (insync) return;

			const qry = prepQuery();

			setStatus('fetching');
			let { data, recordCount, error: err } = await Transport.sync(url, 'get', { ...qry });

			if (err) {
				setStatus('fetching');
			}
			if (data) {
				data = Array.isArray(data) ? data : [data];
				recordCount = recordCount ? recordCount : data.length;
				mutateMany({ data, recordCount });
			}
		},
		signUp = async (param) => {
			const response = await Transport.fetch(`${url}/signup`, 'post', param);
			if (response.error) {
				return { error: response.error, status: response.status };
			}
			if (response.status === 201) {
				return { data: response.data, status: response.status };
			}
		},
		signIn = async (param) => {
			const response = await Transport.fetch(`${url}/signin`, 'post', param);
			if (response.error) {
				return { error: response.error, status: response.status };
			}
			if (response.status === 200) {
				return { data: response.data, status: response.status };
			}
		},
		signOut = async () => {
			return await Transport.fetch(`${url}/signout`, 'get');
		},
		sessionUser = async () => {
			return await Transport.fetch(`${url}/sessionuser`, 'get');
		},
		login = async (param) => {
			const resp = await fetch(`/login`, {
				method: 'POST',
				body: JSON.stringify(param),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const { error, data } = await resp.json();
			if (error) {
				return { error };
			}
			// sessionStore.set('sessionUser', data);

			Transport.auth();
			return { data };
		},
		logout = async () => {
			const resp = await fetch(`/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const { data } = await resp.json();
			if (data) {
				// sessionStore.clear('sessionUser');
				cookieStore.clear('sessionUser');
				Transport.auth();
			}
			return { data };
		},
		post = async (postUrl, param) => {
			return await Transport.fetch(`${url}${postUrl}`, 'post', param);
		},
		get = async (getUrl, param) => {
			return await Transport.fetch(`${url}${getUrl}`, 'get', param);
		},
		destroy = async (where) => {
			const _url = `${url}/${where.id}`;
			const response = await Transport.sync(_url, 'delete', where);
			if (!response.error && response.data) {
				mutateRemove(response.data);
				const message = `${makeName(store)} was successfully destroyed.`;
				return { data: response.data, status: response.status, message };
			}
			return { error: response.error, status: response.status };
		},
		save = async (delta) => {
			const mtd = delta.id ? 'put' : 'post',
				_url = delta.id ? `${url}/${delta.id}` : url;

			const response = await Transport.sync(_url, mtd, delta);
			let message;
			if (!response.error) {
				if (mtd === 'put') {
					mutatePatch(response.data);
					message = `${makeName(store)} was successfully updated.`;
				} else {
					mutateAdd(response.data);
					message = `${makeName(store)} was successfully created.`;
				}
			}
			return { error: response.error, data: response.data, status: response.status, message };
		},
		find = async (value, key = 'id') => {
			if (!insync) {
				await sync();
			}
			return (g(result).data || []).find((v) => v[key] == value);
		},
		dropFile = (_data) => Transport.fetch(`${url}/despace`, 'POST', _data),
		upload = (file) => Transport.upload(`${url}/upload`, file),
		on = (event, handler) => {
			const events = listeners[event] || [];
			const index = events.length;
			events[index] = handler;
			listeners[event] = events;
			return () => listeners[event].splice(index, 1);
		},
		notify = (event, data) => {
			(listeners[event] || []).forEach((f) => f(data));
		},
		startListening = () => {
			const canAdd = (_data) => {
					const reducer = (accum, next) => accum && params[next] == _data[next];

					return Object.entries(params).length > 0
						? Object.keys(params).reduce(reducer, true)
						: true;
				},
				storeTracker = {
					store: namespace,
					listenerID: resultKey,
					async onComets(comet) {
						if (comet.room !== namespace) {
							return console.log(`${comet.room} is not ${namespace}`);
						}
						let exists;
						switch (comet.verb) {
							case 'refresh':
								mutateMany(comet.data);
								notify(comet.verb, comet.data);
								break;
							case 'update':
								// console.log('onComets: ', comet.room, comet.verb, comet.data, params);
								exists = await find(comet.data.id);
								// console.log(`exists:${exists}`);
								if (exists) {
									mutatePatch(comet.data);
									notify(comet.verb, comet.data);
								}
								break;

							case 'create':
								// console.log('onComets: ', comet.room, comet.verb, comet.data, params);
								if (canAdd(comet.data)) {
									exists = await find(comet.data.id);
									if (!exists) {
										mutateAdd(comet.data);
										notify(comet.verb, comet.data);
									}
								}
								break;

							case 'destroy':
								exists = await find(comet.data.id);
								if (exists) {
									mutateRemove(comet.data);
									notify(comet.verb, comet.data);
								}
								break;
						}
					}
				};
			Transport.onCometsNotify(storeTracker);
		};

	startListening();
	return {
		subscribe: result.subscribe,
		sync,
		inSync: () => insync,
		next,
		on,
		value,
		search,
		paginate,
		post,
		get,
		destroy,
		save,
		find,
		remove: mutateRemove,
		patch: mutatePatch,
		add: mutateAdd,
		reset,
		upload,
		dropFile,
		login,
		logout,
		signIn,
		signUp,
		signOut,
		sessionUser,
		filter,
		debug: () => console.log(params, order)
	};
};
Transport.initIO();

class Stores {
	constructor() {
		if (!Stores.instance) {
			this.stores = {};
			Stores.instance = this;
		}
		return Stores.instance;
	}
	useStore(storeName = '', props = {}, orderAndBy = 'asc', namespace = storeName) {
		let orderby = '',
			reverse = storeName.indexOf('~') === 0,
			order;

		if (orderAndBy) {
			const [ord = 'asc', by = ''] = orderAndBy.split('|');
			order = ord;
			orderby = by;
		}

		order = (order || 'asc').toLowerCase();
		const keyMap = { order, orderby, ...props };
		if (orderby) {
			keyMap.orderby = orderby;
		}

		const key = `/${storeName}/${JSON.stringify(keyMap)}`;
		const store = this.stores[key];

		storeName = storeName.replace('~', '');
		namespace = namespace.replace('~', '');

		if (store) {
			return getStore(storeName, props, order, orderby, store, key, namespace, reverse);
		}

		const newStore = writable({ data: [], recordCount: 0, pages: 0, page: 1, status: 'idle' });
		this.stores[key] = newStore;
		return getStore(storeName, props, order, orderby, newStore, key, namespace, reverse);
	}
}
const store = new Stores();
Object.freeze(store);

export const useStore = store.useStore.bind(store);
