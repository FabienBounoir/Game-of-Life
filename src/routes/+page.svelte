<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Random from '$lib/icons/Random.svelte';
	import Clear from '$lib/icons/Clear.svelte';
	import Pause from '$lib/icons/Pause.svelte';
	import Play from '$lib/icons/Play.svelte';
	import { toPng } from 'html-to-image';
	import Download from '$lib/icons/Download.svelte';

	interface Cell {
		x: number;
		y: number;
		color: 'BLACK' | 'WHITE';
	}

	const size: number = 15;
	let grid: Cell[][] = [];
	let played: boolean = false;
	let generation: number = 0;
	let generate: boolean = false;

	const shades = (color: string) => {
		if (color === 'BLACK') {
			return 'var(--primary-950)';
		} else {
			return 'var(--primary-300)';
		}
	};

	onMount(async () => {
		let width: number = window.innerWidth - (window.innerWidth % 15) - 120;
		const height: number = window.innerHeight - 200;

		if (width < 900) width += 50;

		for (let i: number = 0; i < height; i += 15) {
			let row: Cell[] = [];
			for (let j: number = 0; j < width; j += 15) {
				row.push({
					x: j,
					y: i,
					color: Math.random() > 0.7 ? 'WHITE' : 'BLACK'
				});
			}
			grid = [...grid, row];
		}

		window.addEventListener('keydown', (e) => {
			if (e.key === 'r') {
				random();
			}

			if (e.key === 'c') {
				clear();
			}

			if (e.key === 'p') {
				played = !played;
			}
		});

		gameManager();

		onDestroy(() => {
			window.removeEventListener('keydown', (e) => {});
		});
	});

	const gameManager = async () => {
		while (true) {
			if (played) {
				let newGrid: Cell[][] = [];

				for (let i = 0; i < grid.length; i++) {
					newGrid[i] = [];
					for (let j = 0; j < grid[i].length; j++) {
						let neighbors = 0;

						newGrid[i][j] = { ...grid[i][j] };

						if (grid[i - 1]?.[j - 1]?.color === 'WHITE') neighbors++;
						if (grid[i - 1]?.[j]?.color === 'WHITE') neighbors++;
						if (grid[i - 1]?.[j + 1]?.color === 'WHITE') neighbors++;
						if (grid[i]?.[j - 1]?.color === 'WHITE') neighbors++;
						if (grid[i]?.[j + 1]?.color === 'WHITE') neighbors++;
						if (grid[i + 1]?.[j - 1]?.color === 'WHITE') neighbors++;
						if (grid[i + 1]?.[j]?.color === 'WHITE') neighbors++;
						if (grid[i + 1]?.[j + 1]?.color === 'WHITE') neighbors++;

						if (neighbors < 2 || (neighbors > 3 && grid[i][j].color === 'WHITE')) {
							newGrid[i][j].color = 'BLACK';
						}

						if (neighbors === 3 && grid[i][j].color === 'BLACK') {
							newGrid[i][j].color = 'WHITE';
						}
					}
				}

				grid = newGrid;
				generation++;
			}
			await new Promise<void>((r) => setTimeout(r, 100));
		}
	};

	const clear = () => {
		for (let i: number = 0; i < grid.length; i++) {
			for (let j: number = 0; j < grid[i].length; j++) {
				grid[i][j].color = 'BLACK';
			}
		}
		generation = 0;
	};

	const random = () => {
		for (let i: number = 0; i < grid.length; i++) {
			for (let j: number = 0; j < grid[i].length; j++) {
				grid[i][j].color = Math.random() > 0.7 ? 'WHITE' : 'BLACK';
			}
		}
		generation = 0;
	};

	const download = async (e) => {
		generate = true;

		/**
		 * @type {HTMLElement | any}
		 */
		const node = document.querySelector('.game-of-life');
		const dataUrl = await toPng(node, {
			quality: 1
		});

		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = `GameOfLife-${new Date().toLocaleDateString()}.png`;
		a.click();

		generate = false;
	};
</script>

<section>
	<p>Generation: {generation}</p>

	<button on:click={download} disabled={generate}>
		<Download />
	</button>

	<div
		class="game-of-life"
		style={'grid-template-columns: repeat(' + grid?.[0]?.length + ', 15px); --size: ' + size + 'px'}
	>
		{#each grid as row}
			{#each row as cell}
				<div
					on:click={() => (cell.color = cell.color === 'BLACK' ? 'WHITE' : 'BLACK')}
					style={`background-color: ${shades(cell.color)};`}
				></div>
			{/each}
		{/each}
	</div>
</section>

<div class="buttons">
	<button on:click={random}>
		<Random />
	</button>
	<button on:click={() => (played = !played)}>
		{#if played}
			<Pause />
		{:else}
			<Play />
		{/if}
	</button>
	<button on:click={clear}>
		<Clear />
	</button>
</div>

<style lang="scss">
	section {
		.game-of-life {
			--size: 15px;

			background-color: rgb(102, 102, 102);
			display: grid;
			grid-auto-rows: var(--size);
			border-radius: 5px;
			gap: 1px;

			justify-content: center;
			align-items: center;
			margin: auto;
			overflow: hidden;

			div {
				width: var(--size);
				height: var(--size);
			}
		}

		p {
			position: absolute;
			top: 0;
			left: 0;
			padding: 10px;
			color: var(--primary-950, white);
		}
		button {
			position: absolute;
			top: 0;
			right: 0;
			padding: 10px;
			margin: 16px;
		}
	}
	.buttons {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
		margin-bottom: 20px;
	}

	button {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px;
		border: none;
		background-color: var(--primary-950);
		color: white;
		cursor: pointer;
		border-radius: 5px;
		animation: scale 0.3s;

		&:active {
			scale: 0.9;
		}
	}
</style>
