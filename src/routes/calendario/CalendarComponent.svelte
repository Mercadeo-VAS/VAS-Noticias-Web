<script lang="ts">
	import { ABBREVIATED_WEEK_DAYS, MONTH_NAMES } from '$lib/appConstants';
	import type { CalendarEvent, MonthCell } from '$lib/appTypes';
	import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
	import { Button } from '@sveltestrap/sveltestrap';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import Swiper from 'swiper/core';
	import 'swiper/css';
	import type { SwiperOptions } from 'swiper/types';
	import { Temporal } from 'temporal-polyfill';

	// Input prop
	export let calendarEvents: CalendarEvent[] = [];

	// Bindable out prop
	const today = Temporal.Now.plainDateISO();
	export let selectedMonthCell: MonthCell = { date: today, inMonth: true, events: [] };

	// Parse dateStrings into Temporal.PlainDate array and a Set for quick lookups
	const dateStrings = calendarEvents.flatMap((event) => event.dateStrings);
	const plainDates = dateStrings.map((dateString) => Temporal.PlainDate.from(dateString));

	let minDate: Temporal.PlainDate | undefined = undefined;
	let maxDate: Temporal.PlainDate | undefined = undefined;
	const todayMonth = today.with({ day: 1 });
	let minMonth = todayMonth;
	let maxMonth = todayMonth;
	let monthList = [todayMonth];
	let visibleMonth: Temporal.PlainDate = todayMonth;

	if (plainDates.length > 0) {
		const plainDatesPlusToday = [...plainDates, today];
		plainDatesPlusToday.sort((a, b) => Temporal.PlainDate.compare(a, b));
		minDate = plainDatesPlusToday[0];
		maxDate = plainDatesPlusToday.at(-1)!;
		minMonth = minDate.with({ day: 1 });
		maxMonth = maxDate.with({ day: 1 });

		const monthCount = minMonth.until(maxMonth, { largestUnit: 'months' }).months + 1;
		monthList = [];
		while (monthList.length < monthCount) {
			monthList.push(minMonth.add({ months: monthList.length }));
		}
	}

	function generateMonthCells(month: Temporal.PlainDate): MonthCell[] {
		const firstOfMonth = month.with({ day: 1 });
		const firstDayColumn = firstOfMonth.dayOfWeek - 1; // Monday is column 0

		const monthCellsByDateString: Record<string, MonthCell> = {};
		let cellCounter = 0;
		// Fill first row with empty cells before the month starts
		while (cellCounter < firstDayColumn) {
			// Use cellCounter since dateString would be undefined here
			monthCellsByDateString[`empty-${cellCounter}`] = {
				date: undefined,
				inMonth: false,
				events: [],
			};
			cellCounter++;
		}

		// Get the last day of the month
		const lastOfMonth = firstOfMonth.add({ months: 1 }).subtract({ days: 1 });
		const daysInMonth = lastOfMonth.day;

		// Fill with actual month days
		for (let day = 1; day <= daysInMonth; day++) {
			const date = firstOfMonth.with({ day });
			monthCellsByDateString[date.toString()] = { date, inMonth: true, events: [] };
			cellCounter++;
		}

		// Fill remaining cells to complete 42 cells (6 weeks × 7 days)
		while (cellCounter < 42) {
			monthCellsByDateString[`empty-${cellCounter}`] = {
				date: undefined,
				inMonth: false,
				events: [],
			};
			cellCounter++;
		}

		// Assign the events to the corresponding dates
		for (const event of calendarEvents) {
			for (const dateString of event.dateStrings) {
				monthCellsByDateString[dateString]?.events.push(event);
			}
		}

		return Object.values(monthCellsByDateString);
	}

	const monthCellsByMonth = monthList.map((m) => generateMonthCells(m));

	function isSame(a: Temporal.PlainDate | undefined, b: Temporal.PlainDate | undefined) {
		if (!a || !b) return false;
		return Temporal.PlainDate.compare(a, b) === 0;
	}

	let monthAndYear = '';
	$: {
		const monthName = MONTH_NAMES[visibleMonth.month - 1]; // month is 1..12
		const year = visibleMonth.year;
		monthAndYear = `${monthName} ${year}`;
	}

	function selectMonthCell(monthCell: MonthCell) {
		if (!monthCell.date) return;
		selectedMonthCell = monthCell;
	}

	function handleSlideChange(swiper: any) {
		swiperState.isBeginning = swiper.isBeginning;
		swiperState.isEnd = swiper.isEnd;

		visibleMonth = monthList[swiper.activeIndex];
	}

	let calendarSwiper: Swiper;
	let calendarSwiperParams: SwiperOptions = {
		slidesPerView: 'auto',
		autoHeight: true,
		spaceBetween: 48,
	};
	let swiperState = { isBeginning: true, isEnd: true };

	function goToToday() {
		// Slide to today's month
		const todaysMonthIndex = monthList.findIndex((month) => month.equals(todayMonth));
		calendarSwiper.slideTo(todaysMonthIndex);

		// Select today's date cell
		const currentMonthCells = monthCellsByMonth[todaysMonthIndex];
		const todayCell = currentMonthCells.find((cell) => isSame(cell.date, today))!;
		selectMonthCell(todayCell);
	}

	onMount(() => {
		calendarSwiper = new Swiper('.calendar-swiper', calendarSwiperParams);

		swiperState.isEnd = calendarSwiper.isEnd;

		/**
		 * This if-else is basically to decide whether to show the visibleMonth change immediately (for mouse users)
		 * or after the transition ends (for touch users).
		 **/
		if (window.matchMedia('(any-pointer: fine)').matches) {
			// If the device has a fine pointer (e.g., mouse)
			calendarSwiper.on('slideChange', handleSlideChange);
		} else {
			calendarSwiper.on('transitionEnd', handleSlideChange);
		}
	});
</script>

<div
	class="calendar fade-in"
	aria-label="Calendar"
>
	<h4>{monthAndYear}</h4>

	<div class="swiper calendar-swiper">
		<div class="swiper-wrapper">
			{#each monthCellsByMonth as monthCells}
				<div class="swiper-slide month">
					<div class="row-weekdays">
						{#each ABBREVIATED_WEEK_DAYS as dayOfTheWeek}
							<div class="app-day-of-the-week">{dayOfTheWeek}</div>
						{/each}
					</div>
					<div class="grid">
						{#each monthCells as cell}
							{#if cell.inMonth}
								<button
									class="day"
									class:today={isSame(cell.date, today)}
									class:app-date-selected={isSame(
										cell.date,
										selectedMonthCell.date,
									)}
									on:click={() => selectMonthCell(cell)}
								>
									<span class="day-number">{cell.date?.day || ''}</span>
									{#if cell.events.length}
										<div class="event-dots">
											{#each cell.events as event}
												<div
													class="event-dot"
													style="background-color: {event.ministry
														.hexColor}"
												/>
											{/each}
										</div>
									{/if}
								</button>
							{:else}
								<div class="empty-cell" />
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="calendar-buttons-row">
		<Button
			class="today-button"
			size="sm"
			color="light"
			on:click={goToToday}
			aria-label="Go to current month"
		>
			Hoy
		</Button>

		<Button
			size="sm"
			class="calendar-nav-button"
			aria-label="Previous month"
			color="primary"
			disabled={swiperState.isBeginning}
			on:click={() => calendarSwiper.slidePrev()}
		>
			<Fa icon={faAngleLeft} />
		</Button>
		<Button
			size="sm"
			class="calendar-nav-button"
			aria-label="Next month"
			color="primary"
			disabled={swiperState.isEnd}
			on:click={() => {
				console.log('swiperState', swiperState.isEnd);
				calendarSwiper.slideNext();
			}}
		>
			<Fa icon={faAngleRight} />
		</Button>
	</div>
</div>

<style lang="scss">
	.calendar {
		position: relative;

		@media (width < 48rem) {
			width: 80vw;
			align-self: center;
		}

		@media (width >= 48rem) {
			width: 320px;
			margin-block: 1.675rem 0.25rem;
		}
	}

	h4 {
		font-size: min(18px, 4vw);
		margin: 0;
		opacity: 0.9;

		@media (width < 48rem) {
			line-height: 2rem;
			margin-left: 1rem;
		}

		@media (width >= 48rem) {
			text-align: center;
		}
	}

	.calendar-swiper {
		margin-top: 0.75rem;
		padding-bottom: 0.5rem;

		@media (width < 48rem) {
			width: 100vw;
			margin-inline: -10vw;
			padding-inline: 10vw;
		}

		@media (width >= 48rem) {
			width: calc(100% + (var(--app-page-padding-x) * 2));
			margin-inline: var(--app-page-margin-x);
			padding-inline: var(--app-page-padding-x);
		}
	}

	.month {
		@media (width < 48rem) {
			width: 100%;
		}

		@media (width >= 48rem) {
			width: 320px;
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.fade-in {
		animation: fadeIn 1s ease-in forwards;
	}

	.row-weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		margin-block: 6px;
	}

	.app-day-of-the-week {
		padding-bottom: 4px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 4px;
	}

	.day {
		all: unset;
		box-sizing: border-box;
		font-size: min(1rem, 3.5vw);
		font-weight: 600;
		opacity: 0.9;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		cursor: pointer;
		position: relative;

		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}

		&.today {
			border: var(--app-border-today);
		}
	}

	.day,
	.empty-cell {
		@media (width < 48rem) {
			height: 40px;
		}

		@media (width >= 48rem) {
			height: 48px;
		}
	}

	.app-date-selected.day {
		font-weight: 800;
		opacity: 1;
	}

	.event-dots {
		position: absolute;
		bottom: 0.25rem;
		display: flex;
		gap: min(2.5px, 0.6vw);
	}

	.event-dot {
		width: min(8px, 2vw);
		aspect-ratio: 1;
		border-radius: 50%;
	}

	.calendar-buttons-row {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: flex-end;

		@media (width < 48rem) {
			position: absolute;
			top: 0;
			right: 0;

			:global(.btn-primary) {
				width: 10vw;
			}
		}

		@media (width >= 48rem) {
			padding-right: 1px;

			:global(.btn-primary) {
				width: 38px;
			}

			:global(.btn-light) {
				width: 64px;
			}
		}
	}

	:global(.today-button) {
		width: 60px;
	}
</style>
