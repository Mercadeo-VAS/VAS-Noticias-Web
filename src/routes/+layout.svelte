<script lang="ts">
	import Header from './HeaderComponent.svelte';

	import { onMount } from 'svelte';
	import { Temporal } from 'temporal-polyfill';
	import '../styles/main.scss';

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
		max-width: 902px;
		background-color: white;
		padding: 0 var(--app-page-padding-x);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;

		@media (width < 48rem) {
			margin-block: 0;
			height: calc(100dvh - var(--app-navbar-height));
			overflow: auto;
		}

		@media (width >= 48rem) {
			$margin-y: 1rem;
			margin: $margin-y auto;
			min-height: calc(100dvh - 2 * $margin-y);
		}
	}
</style>
