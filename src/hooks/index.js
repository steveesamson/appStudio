import cookie from 'cookie';
import { unHash } from 'utils/cypher';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	if (cookies.sessionUser) {
		const { token, ...rest } = unHash(cookies.sessionUser);
		event.locals = rest;
	} else {
		event.locals = null;
	}
	const response = await resolve(event);
	return response;
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
	return event.locals;
}
