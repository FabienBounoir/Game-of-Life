<script lang="ts">
	import { onMount } from 'svelte';
	import Random from '$lib/icons/Random.svelte';
	import Clear from '$lib/icons/Clear.svelte';
	import Pause from '$lib/icons/Pause.svelte';
	import Play from '$lib/icons/Play.svelte';

	interface Cell {
		x: number;
		y: number;
		color: 'BLACK' | 'WHITE';
	}

	let grid: Cell[][] = [];
	let size: number = 15;
	let played: boolean = false;

	onMount(async () => {
		let width: number = window.innerWidth - (window.innerWidth % 15) - 100;
		const height: number = window.innerHeight - 200;

		for (let i: number = 0; i < height; i += 15) {
			let row: Cell[] = [];
			for (let j: number = 0; j < width; j += 15) {
				row.push({
					x: j,
					y: i,
					color: 'BLACK'
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
			}
			await new Promise<void>((r) => setTimeout(r, 120));
		}
	};

	const clear = () => {
		for (let i: number = 0; i < grid.length; i++) {
			for (let j: number = 0; j < grid[i].length; j++) {
				grid[i][j].color = 'BLACK';
			}
		}
	};

	const random = () => {
		for (let i: number = 0; i < grid.length; i++) {
			for (let j: number = 0; j < grid[i].length; j++) {
				grid[i][j].color = Math.random() > 0.7 ? 'WHITE' : 'BLACK';
			}
		}
	};
</script>

<section
	style={'grid-template-columns: repeat(' + grid?.[0]?.length + ', 15px); --size: ' + size + 'px'}
>
	{#key grid}
		{#each grid as row}
			{#each row as cell}
				<div
					on:click={() => (cell.color = cell.color === 'BLACK' ? 'WHITE' : 'BLACK')}
					style={`background-color: ${cell.color};`}
				></div>
			{/each}
		{/each}
	{/key}
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
			background-color: #000000;
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
