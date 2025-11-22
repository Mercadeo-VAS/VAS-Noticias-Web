<script lang="ts">
	import { ABBREVIATED_WEEK_DAYS } from '$lib/appConstants';
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
	const dateStrings = calendarEvents.map((event) => event.dateString);
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
			monthCellsByDateString[event.dateString]?.events.push(event);
		}

		return Object.values(monthCellsByDateString);
	}

	const monthCellsByMonth = monthList.map((m) => generateMonthCells(m));

	function isSame(a: Temporal.PlainDate | undefined, b: Temporal.PlainDate | undefined) {
		if (!a || !b) return false;
		return Temporal.PlainDate.compare(a, b) === 0;
	}

	$: monthAndYear = visibleMonth.toLocaleString(undefined, {
		month: 'long',
		year: 'numeric',
	});

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
		spaceBetween: 32,
		on: {
			slideChange: handleSlideChange,
			// sliderMove: handleSlideChange,
			transitionEnd: handleSlideChange, // TODO: *** Hay que corregir esto. Quiero que el monthAndYear cambie inmediatamente al presionar los botones, pero que se actualice al final de la animación cuando se hace swipe manualmente. ***
		},
	};
	let swiperState = { isBeginning: true, isEnd: false };

	function goToCurrentMonth() {
		const todaysMonthIndex = monthList.findIndex((month) => month.equals(todayMonth));
		calendarSwiper.slideTo(todaysMonthIndex);
	}

	onMount(() => {
		calendarSwiper = new Swiper('.calendar-swiper', calendarSwiperParams);
	});
</script>

<div
	class="calendar"
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
											{#each cell.events as _event}
												<div class="event-dot" />
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
			<!-- Dummy spacer slide to make the last month align to the left -->
			<div class="swiper-slide month"></div>
		</div>
	</div>

	<div class="calendar-buttons-row">
		<Button
			class="today-button"
			size="sm"
			color="light"
			on:click={goToCurrentMonth}
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
			on:click={() => calendarSwiper.slideNext()}
		>
			<Fa icon={faAngleRight} />
		</Button>
	</div>
</div>

<style lang="scss">
	.calendar {
		width: 320px;
		margin-block: 1.65rem 0.25rem;
	}

	h4 {
		font-size: min(18px, 4vw);
		opacity: 0.9;
		text-align: center;
		margin-bottom: 0.75rem;
	}

	.calendar-swiper {
		width: calc(200% + 4rem);
		margin-left: -2rem;
		padding-left: 2rem;
	}

	.month {
		width: 320px;
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
		font-size: min(1rem, 3.5vw);
		font-weight: 600;
		opacity: 0.9;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid transparent;
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
		height: 48px;
	}

	.app-date-selected.day {
		font-weight: 800;
		opacity: 1;
	}

	.event-dots {
		position: absolute;
		bottom: 4px;
		display: flex;
		gap: 3px;
	}

	.event-dot {
		width: 8px;
		height: 8px;
		background-color: var(--bs-primary);
		border-radius: 50%;
	}

	.calendar-buttons-row {
		margin-top: 0.5rem;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: flex-end;
		padding-right: 3px;
	}

	:global(.today-button) {
		width: 60px;
	}

	:global(.calendar-nav-button) {
		width: 40px;
	}
</style>
