<script lang="ts">
	import Header from './HeaderComponent.svelte';

	import '../styles/main.scss';
</script>

<main>
	<Header />

	<slot />
</main>

<style lang="scss">
	main {
		$margin-y: 1rem;
		margin: $margin-y auto;
		max-width: 902px;
		height: calc(100dvh - 2 * $margin-y);
		background-color: white;
		padding: 2rem min(3rem, 6vw) 0;
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
			min-height: 100vh;
		}
	}
</style>
