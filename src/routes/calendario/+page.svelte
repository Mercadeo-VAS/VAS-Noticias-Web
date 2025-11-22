<script lang="ts">
	import { onMount } from 'svelte';

	import type { MonthCell } from '$lib/appTypes';
	import type { PageData } from '../calendario/$types';
	import CalendarComponent from './CalendarComponent.svelte';
	import DayEventsComponent from './DayEventsComponent.svelte';

	export let data: PageData;

	const { calendarEvents } = data;

	let selectedMonthCell: MonthCell;

	onMount(() => {});
</script>

<section>
	<div class="app-dates-row">
		<CalendarComponent
			{calendarEvents}
			bind:selectedMonthCell
		/>
		<div class="date-events-container app-date-selected">
			{#if selectedMonthCell?.date}
				<DayEventsComponent {selectedMonthCell} />
			{/if}
		</div>
	</div>
</section>

<style lang="scss">
	section {
		padding-top: 1rem;
	}

	.app-dates-row {
		padding: min(1rem, 6vw) var(--app-page-padding-x);
		padding-right: 1rem;
		display: flex;
		gap: 2rem;

		h4 {
			width: 100%;
			font-size: min(22px, 5vw);
			text-align: center;
			margin-bottom: 0.25rem;
		}
	}

	.date-events-container {
		flex: 1;
		padding: 1.5rem;
		border-radius: 0.5rem;
		z-index: 1;
	}
</style>
