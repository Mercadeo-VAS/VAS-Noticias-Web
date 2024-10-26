<script lang="ts">
	import Header from './Header.svelte';
	import UpcomingEvents from './UpcomingEvents.svelte';

</script>

<main>
	<Header />

	<section>
		<UpcomingEvents />
	</section>

	<section style="display: none;">
		<h2>Anuncios</h2>
	</section>
</main>

<style lang="scss">
	$breakpoint-width: 920px;

	main {
		margin: 1rem auto;
		max-width: 902px;
		background-color: white;
		padding: 2rem min(3rem, 6vw);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	@media (max-width: $breakpoint-width) {
		main {
			margin-block: 0;
			min-height: 100vh;
		}
	}
</style>
