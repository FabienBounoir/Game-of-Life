<script>
	import '../app.scss';
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
