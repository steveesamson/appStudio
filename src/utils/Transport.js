import { io } from 'socket.io-client';
import fetch from 'isomorphic-unfetch';
import { useEvents } from 'utils/events';
import { resolveAsyncAwait } from 'utils/resolveAsyncAwait';
// import { sessionStore } from 'utils/clientStore';
import { cookieStore } from 'utils/clientStore';
import config from '$lib/config';

const loading = useEvents('loading');
let socket = null;

const withFetch = function (url, method, params) {
	// console.log('withFetch:', url, method, params);
	const headers = {
			'Content-type': 'application/json; charset=UTF-8',
			'x-access-token': cookieStore.token()
		},
		qs = () => {
			const data = params || {};
			return Object.keys(data)
				.map((k) => `${k}=${encodeURIComponent(data[k])}`)
				.join('&');
		},
		hasBody = ['post', 'put'].includes(method.toLowerCase());

	if (!hasBody) {
		const query = qs();
		if (query) {
			url = `${url}?${query}`;
		}
	}
	loading.setTo(true);
	return resolveAsyncAwait(
		hasBody
			? fetch(`${config.BASE_URL()}${url}`, {
					method,
					headers,
					// credentials: 'include',
					body: JSON.stringify(params || {})
			  })
			: fetch(`${config.BASE_URL()}${url}`, {
					method,
					headers
					// credentials: 'include'
			  })
	);
};

const Transport = {
	cometListeners: {},
	destroy() {
		Transport.sync = withFetch;
		socket = null;
	},
	auth() {
		if (!socket) return;
		socket.auth.token = cookieStore.token();
		socket.disconnect().connect();
	},
	initIO() {
		if (socket !== null) return;
		// socket = io(`//${config.HOST}:${config.PORT}`, { transports: ['websocket'] }); //['polling','websocket'];
		socket = io(`${config.BASE_HOST()}`, {
			transports: ['websocket'],
			auth: {
				'x-access-token': cookieStore.token()
			}
		}); //['polling','websocket'];
		socket.on('connect', function () {
			Transport.sync = function (url, method, data) {
				// console.log('IO request:..', url, method, data);
				return new Promise((resolve, reject) => {
					try {
						loading.setTo(true);
						socket.emit(method, { path: url, data }, (m) => {
							// console.log('io res: ', m, 'path: ',url, 'method: ', method, ' args: ', data );
							const { status, body } = m;
							let all = { status, ...(body || {}) };
							if (all.error && all.error.indexOf('Duplicate') >= 0) {
								all.error = 'Duplicate data error';
							}
							loading.setTo(false);
							resolve(all);
						});
					} catch (error) {
						loading.setTo(false);
						resolve({ error });
					}
				});
			};
		});

		socket.on('comets', Transport.onComets);
	},
	onCometsNotify(listener) {
		const storeListeners = Transport.cometListeners[listener.store] || [];
		// console.log('register: ', listener);
		if (storeListeners.find((l) => l.listenerID === listener.listenerID)) return;

		storeListeners.push(listener);
		Transport.cometListeners[listener.store] = storeListeners;
	},
	stopCometsOn(listener) {
		const storeListeners = Transport.cometListeners[listener.store] || [];
		if (!storeListeners.length) return;
		const others = storeListeners.filter((l) => l.listenerID !== listener.listenerID);
		Transport.cometListeners[listener.store] = others;
	},
	onComets(comets) {
		// console.log('oncomets: ', comets.room, comets.verb, comets.data);
		let listeners = Transport.cometListeners[comets.room] || [];
		if (!listeners.length) return;
		listeners.forEach((listener) => listener.onComets(comets));
	},
	upload(url, body) {
		loading.setTo(true);
		return resolveAsyncAwait(
			fetch(`${config.BASE_URL()}${url}`, {
				headers,
				method: 'POST',
				// credentials: 'include',
				body
			})
		);
	},
	fetch: withFetch,
	sync: withFetch
};

export { Transport, config };
