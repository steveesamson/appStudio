import { sessionStore } from 'utils/clientStore';
import { Transport } from 'utils/Transport';
export const login = async (param) => {
	const response = await fetch(`/login`, {
		method: 'POST',
		body: JSON.stringify(param),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const { error, data } = await response.json();
	console.log({ data, error });
	if (error) {
		return { error };
	}
	sessionStore.set('sessionUser', data);
	await Transport.auth();
	return { data };
};
export const logout = async () => {
	await fetch(`/logout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	sessionStore.clear('sessionUser');
	await Transport.auth();
	return { data: true };
};
