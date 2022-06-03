import cookie from 'cookie';
/** @type {import('./logout').RequestHandler} */
export async function post(event) {
	const headers = {
		'set-cookie': cookie.serialize('sessionUser', '', {
			path: '/',
			// httpOnly: true,
			sameSite: 'strict'
		})
	};
	return {
		status: 200,
		headers,
		body: { data: true }
	};
}
