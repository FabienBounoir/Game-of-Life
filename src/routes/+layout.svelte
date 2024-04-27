<script>
	import { onDestroy, onMount } from 'svelte';
	import '../app.scss';
	import myshades from '$lib/myshades';

	onMount(async () => {
		let color = Math.floor(Math.random() * 16777215).toString(16);

		if (color.length < 6) color = '0'.repeat(6 - color.length) + color;

		myshades({
			primary: `#${color}`
		});

		window.addEventListener('keydown', (e) => {
			if (e.key === 'r') {
				color = Math.floor(Math.random() * 16777215).toString(16);

				if (color.length < 6) color = '0'.repeat(6 - color.length) + color;

				myshades({
					primary: `#${color}`
				});
			}
		});

		onDestroy(() => {
			window.removeEventListener('keydown', (e) => {});
		});
	});
</script>

<div class="container">
	<slot />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100svh;
	}
</style>
