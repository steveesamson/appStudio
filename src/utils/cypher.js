import { browser } from '$app/env';
const server = {
	btoa(b) {
		return new Buffer.from(b).toString('base64');
	},
	atob(a) {
		return new Buffer.from(a, 'base64').toString('binary');
	}
};

const _encode = function (s) {
	var enc = '';
	var str = '';
	// make sure that input is string
	str = s + '';

	for (var i = 0; i < s.length; i++) {
		// create block
		var a = s.charCodeAt(i);
		// bitwise XOR
		var b = a ^ '120';
		enc = enc + String.fromCharCode(b);
	}
	return enc;
};
export const encrypt = function (clear) {
	return browser ? window.btoa(_encode(clear)) : server.btoa(_encode(clear));
};

export const decrypt = function (sealed) {
	return browser ? _encode(window.atob(sealed)) : _encode(server.atob(sealed));
};

export const asHash = (param) => {
	if (!param) return null;
	try {
		const enc = typeof param === 'string' ? param : encrypt(JSON.stringify(param));
		return encodeURIComponent(enc);
	} catch (e) {
		return null;
	}
};

export const unHash = (hash) => {
	if (hash) {
		const decodedHash = decodeURIComponent(hash);
		const decryptedHash = decrypt(decodedHash);
		try {
			return decryptedHash ? JSON.parse(decryptedHash) : null;
		} catch (e) {
			return null;
		}
	}
	return null;
};
