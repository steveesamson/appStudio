import { browser } from '$app/env';
import { unHash } from './cypher';
import cookies from 'js-cookie';

export const cookieStore = {
	set(key, value, options) {
		if (!key || !value || !browser) return;
		if (options) {
			cookies.set(key, value, options);
		} else {
			cookies.set(key, value);
		}
	},
	get(key) {
		if (!browser) return;
		return cookies.get(key);
	},
	clear(key) {
		cookies.remove(key);
	},
	token() {
		const value = this.get('sessionUser');
		const sessionUser = unHash(value || '');
		if (sessionUser) {
			return sessionUser.token;
		}
		return '';
	}
};

export const sessionStore = {
	set(key, value) {
		if (!key || !value || !browser) return;
		sessionStorage.setItem(key, JSON.stringify(value));
	},
	get(key) {
		if (!browser) return;
		const value = sessionStorage.getItem(key);
		return value ? JSON.parse(value) : null;
	},
	clear(key) {
		sessionStorage.removeItem(key);
	},
	token() {
		const value = this.get('sessionUser');
		const sessionUser = unHash(value || '');
		if (sessionUser) {
			return sessionUser.token;
		}
		return '';
	}
};
export const localStore = {
	set(key, value) {
		if (!key || !value || !browser) return;
		localStorage.setItem(key, JSON.stringify(value));
	},
	clear(key) {
		localStorage.removeItem(key);
	},
	get(key) {
		if (!browser) return;
		const value = localStorage.getItem(key);
		return value ? JSON.parse(value) : null;
	}
};
