import { useStore } from 'utils/store';
import { asHash } from 'utils/cypher';
import cookie from 'cookie';

/** @type {import('./login').RequestHandler} */
export async function post(event) {
	const detail = await event.request.json();
	const auth = useStore('auth');
	const { error, data } = await auth.signIn(detail);
	const headers = {};
	let sessionUser;
	if (data) {
		const { id, avatar, email, fullName, streamId, role, cans, token } = data;
		sessionUser = asHash({ id, avatar, email, fullName, streamId, token, role, cans });
		headers['set-cookie'] = cookie.serialize('sessionUser', sessionUser, {
			path: '/',
			// httpOnly: true,
			sameSite: 'strict'
		});
	}

	return {
		status: 200,
		headers,
		body: {
			data: sessionUser,
			error
		}
	};
}
