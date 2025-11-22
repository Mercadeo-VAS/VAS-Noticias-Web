<script lang="ts">
	import Header from './HeaderComponent.svelte';

	import '../styles/main.scss';
	import { onMount } from 'svelte';
	import { Temporal } from 'temporal-polyfill';

	const reloadPageIfNewDate = () => {
		const today = Temporal.Now.plainDateISO().toString();
		const lastReloadDate = localStorage.getItem('lastReloadDate');

		if (lastReloadDate !== today) {
			localStorage.setItem('lastReloadDate', today);
			location.reload();
		}
	};

	onMount(() => {
		const today = Temporal.Now.plainDateISO().toString();
		localStorage.setItem('lastReloadDate', today);
	});
</script>

<svelte:window on:focus={reloadPageIfNewDate} />

<main>
	<Header />

	<slot />
</main>

<style lang="scss">
	main {
		$margin-y: 1rem;
		margin: $margin-y auto;
		max-width: 902px;
		min-height: calc(100dvh - 2 * $margin-y);
		background-color: white;
		padding: min(2rem, 6vw) var(--app-page-padding-x) 0;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;
	}

	$breakpoint-width: 920px;

	@media (max-width: $breakpoint-width) {
		main {
			margin-block: 0;
			min-height: 100dvh;
		}
	}
</style>
