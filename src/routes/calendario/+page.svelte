<script lang="ts">
	import type { MonthCell } from '$lib/appTypes';
	import type { PageData } from '../calendario/$types';
	import CalendarComponent from './CalendarComponent.svelte';
	import DayEventsComponent from './DayEventsComponent.svelte';

	export let data: PageData;

	const { calendarEvents } = data;

	let selectedMonthCell: MonthCell;
</script>

<section>
	<div class="app-dates-row">
		<CalendarComponent
			{calendarEvents}
			bind:selectedMonthCell
		/>
		<div class="date-events-container fly-in">
			{#if selectedMonthCell?.date}
				<DayEventsComponent {selectedMonthCell} />
			{/if}
		</div>
	</div>
</section>

<style lang="scss">
	@media (width < 48rem) {
		section {
			flex: 1;
		}
	}

	.app-dates-row {
		padding: min(1rem, 3vw) var(--app-page-padding-x);
		display: flex;
		overflow: hidden;

		@media (width < 48rem) {
			flex-direction: column;
			height: 100%;
			padding-bottom: 0;
		}

		@media (width >= 48rem) {
			flex-direction: row;
			gap: 2rem;
			padding-right: 1rem;
		}
	}

	.date-events-container {
		flex: 1;
		padding: 1.5rem;
		padding-bottom: 3rem;
		background-color: white;

		@media (width < 48rem) {
			padding-inline: var(--app-page-padding-x);
			margin-inline: var(--app-page-margin-x);
		}

		@media (width >= 48rem) {
			border-radius: 0.5rem;
			z-index: 1;
			opacity: 0; // Will be overridden by .fly-in
			box-shadow:
				0 4px 6px -1px rgb(0 0 0 / 0.1),
				0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
		}
	}

	@keyframes fly-in-mobile {
		0% {
			opacity: 0;
			transform: translateY(50px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fly-in-desktop {
		0% {
			opacity: 0;
			transform: translateX(50px);
		}
		100% {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@media (width < 48rem) {
		.fly-in {
			animation: fly-in-mobile 1s ease-out forwards;
		}
	}

	@media (width >= 48rem) {
		.fly-in {
			animation: fly-in-desktop 1s ease-out forwards;
		}
	}
</style>
