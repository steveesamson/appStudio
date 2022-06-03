<script>
	import { createEventDispatcher } from 'svelte';
	let streamIdOrEmail, password;
	const dispatch = createEventDispatcher();
	function onLogin() {
		dispatch('login', { streamIdOrEmail, password });
	}
</script>

<form>
	<h3>Login please.</h3>
	<div>
		<label for="username">Username:</label>
		<input type="text" id="username" bind:value={streamIdOrEmail} />
	</div>
	<div>
		<label for="password">Password:</label>
		<input type="text" id="password" bind:value={password} />
	</div>
	<div>
		<button type="button" on:click={onLogin}> Login </button>
	</div>
</form>

<style>
	:global(body) {
		padding: 0;
		margin: 0;
		text-align: center;
	}
	form {
		padding: 2rem;
		width: 400px;
		margin: auto;
		background-color: aliceblue;
		border-radius: 8px;
	}
	input[type='text'] {
		padding: 0.5rem;
		border: 1px solid #ededed;
		border-radius: 4px;
	}
	div {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 5px auto;
	}
	label {
		text-align: left;
		width: 80px;
	}
	button {
		margin: 1rem auto;
		padding: 0.5rem 1.4rem;
	}
</style>
