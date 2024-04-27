<script lang="ts">
	import { onMount } from 'svelte';
	import Random from '$lib/icons/Random.svelte';
	import Clear from '$lib/icons/Clear.svelte';
	import Pause from '$lib/icons/Pause.svelte';
	import Play from '$lib/icons/Play.svelte';
	import { fade } from 'svelte/transition';

	interface Cell {
		x: number;
		y: number;
		color: 'BLACK' | 'WHITE';
	}

	const size: number = 15;
	let grid: Cell[][] = [];
	let played: boolean = false;
	let generation: number = 0;

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
					color: random() > 0.7 ? 'WHITE' : 'BLACK'
				});
			}
			grid = [...grid, row];
		}

		gameManager();
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
</script>

<section
	style={'grid-template-columns: repeat(' + grid?.[0]?.length + ', 15px); --size: ' + size + 'px'}
>
	<p>Generation: {generation}</p>
	{#each grid as row}
		{#each row as cell}
			<div
				on:click={() => (cell.color = cell.color === 'BLACK' ? 'WHITE' : 'BLACK')}
				style={`background-color: ${shades(cell.color)};`}
			></div>
		{/each}
	{/each}
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

		p {
			position: absolute;
			top: 0;
			left: 0;
			padding: 10px;
			color: var(--primary-950, white);
		}

		div {
			width: var(--size);
			height: var(--size);
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
	}
</style>
