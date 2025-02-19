<script lang="ts">
	import type { PageData } from './$types';
	import AnnouncementsComponent from './AnnouncementsComponent.svelte';
	import Header from './HeaderComponent.svelte';
	import UpcomingEventsComponent from './UpcomingEventsComponent.svelte';

	import '../styles/main.scss';

	export let data: PageData;

	const { eventList, weekList, announcementList } = data;
</script>

<main>
	<Header />

	<section>
		<UpcomingEventsComponent
			{eventList}
			{weekList}
		/>
	</section>

	<section>
		<AnnouncementsComponent {announcementList} />
	</section>
</main>

<style lang="scss">
	$breakpoint-width: 920px;

	main {
		$margin-y: 1rem;
		margin: $margin-y auto;
		max-width: 902px;
		min-height: calc(100dvh - 2 * $margin-y);
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
