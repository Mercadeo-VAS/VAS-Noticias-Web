<script lang="ts">
	import { MONTH_NAMES, WEEK_DAYS } from '$lib/appConstants';
	import type { CalendarEvent, MonthCell } from '$lib/appTypes';
	import { Temporal } from 'temporal-polyfill';

	// Input prop
	export let selectedMonthCell: MonthCell;

	let date: Temporal.PlainDate | undefined;
	let events: CalendarEvent[] = [];
	let fullDateString: string = '';

	$: {
		date = selectedMonthCell.date;
		events = selectedMonthCell.events || [];
		fullDateString = getFullDateString(date);
	}

	/**
	 * Returns "Martes, 18 de Noviembre de 2025" style date string,
	 */
	function getFullDateString(plainDate: Temporal.PlainDate | undefined): string {
		if (!plainDate) {
			return '';
		}

		const weekday = WEEK_DAYS[plainDate.dayOfWeek - 1]; // dayOfWeek is 1..7
		const monthName = MONTH_NAMES[plainDate.month - 1]; // month is 1..12
		const day = plainDate.day + (plainDate.day === 1 ? 'ro' : '');
		const year = plainDate.year;

		return `${weekday}, ${day} de ${monthName} de ${year}`;
	}
</script>

<div class="day-events">
	<h3>{fullDateString}</h3>

	{#if events.length > 0}
		<ul class="event-list">
			{#each events as event}
				<li class="event">
					<div class="ministry">{event.ministry}</div>
					<div>{event.title}</div>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="no-events-container">
			<p>No hay eventos este día.</p>
		</div>
	{/if}
</div>

<style lang="scss">
	.day-events {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	h3 {
		font-size: min(20px, 5vw);
		text-align: center;
		margin-bottom: 1rem;
	}

	.event-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.event {
		$border-size: 1px;
		$left-border-size: 5px;

		padding: 1rem;
		margin-left: $left-border-size - 1px;
		background-color: rgba(var(--app-color-primary-rgb), 0.1);
		border-top-right-radius: 0.25rem;
		border-bottom-right-radius: 0.25rem;
		border: $border-size solid rgba(var(--app-color-primary-rgb), 0.2);
		position: relative;

		&::before {
			content: '';
			position: absolute;
			left: -$left-border-size;
			top: -$border-size;
			bottom: -$border-size;
			width: $left-border-size;
			background-color: var(--bs-primary);
		}

		+ .event {
			margin-top: 1rem;
		}

		.ministry {
			font-size: min(18px, 4vw);
			font-weight: bold;
			margin-bottom: 0.5rem;
		}
	}

	.no-events-container {
		flex: 1;
		display: grid;
		place-items: center;
	}
</style>
