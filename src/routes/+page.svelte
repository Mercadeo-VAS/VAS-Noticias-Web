<script lang="ts">
	import { onMount } from 'svelte';
	import Swiper from 'swiper/bundle';
	import type { SwiperOptions } from 'swiper/types';

	import Header from './Header.svelte';

	import 'swiper/css/bundle'; // TODO: *** Change from bundle to the specific modules ***
	import '../styles/main.scss';

	type CalendarDate = {
		date: string;
		events: Event[];
		weekIndex: number;
	};

	type Event = {
		index: number;
		imageLink: string;
		date: string;
		calendarDate?: CalendarDate;
	};

	const DATES_SWIPE_SPEED_IN_MS = 1000;
	const EVENTS_SWIPE_SPEED_IN_MS = 1000;

	let datesSwiper: Swiper;
	let upcomingEventsSwiper: Swiper;
	let selectedEvent: Event;
	let selectedDate: CalendarDate;
	let monthAndYear: string;
	let startFly = false;

	const monthNames = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre',
	];
	const abbreviatedMonths = [
		'Ene',
		'Feb',
		'Mar',
		'Abr',
		'May',
		'Jun',
		'Jul',
		'Ago',
		'Sep',
		'Oct',
		'Nov',
		'Dic',
	];
	const daysOfTheWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

	// TODO: Validate that that the date format is 'yyyy-mm-dd'. If day, for example, is just `d` instead of `dd`, it will cause an error.
	const upcomingEvents: Event[] = [
		{
			index: 0,
			imageLink: 'images/Live - Emociones que matan.jpg',
			date: '2024-08-28',
		},
		{
			index: 1,
			imageLink: 'images/Evento - Taller.jpg',
			date: '2024-09-07',
		},
		{
			index: 2,
			imageLink: 'images/Evento - Feria Empresarial Kids.jpg',
			date: '2024-09-07',
		},
		{
			index: 3,
			imageLink: 'images/Curso - Te vuelvo a elegir.jpg',
			date: '2024-10-05',
		},
		{
			index: 4,
			imageLink: 'images/Curso - Prematrimonial.jpg',
			date: '2024-10-05',
		},
	];

	/**
	 * Generate a list of dates from the min and max dates in the events list
	 */

	const today = new Date();
	const eventDates = upcomingEvents
		.map((event) => new Date(event.date).getTime())
		.concat(today.getTime());
	const minDate = new Date(Math.min(...eventDates));
	const maxDate = new Date(Math.max(...eventDates));

	// Get previous Monday from the minDate
	const minDateDay = minDate.getUTCDay();
	const daysToSubtract = (minDateDay + 6) % 7;
	const previousMonday = new Date(minDate);
	previousMonday.setDate(minDate.getDate() - daysToSubtract);

	// Get next Sunday from maxDate
	const maxDateDay = maxDate.getUTCDay();
	const daysToAdd = (7 - maxDateDay) % 7;
	const nextSunday = new Date(maxDate);
	nextSunday.setDate(maxDate.getDate() + daysToAdd);

	let datesList: CalendarDate[] = [];
	for (
		let currentDate = new Date(previousMonday);
		currentDate <= nextSunday;
		currentDate.setDate(currentDate.getDate() + 1)
	) {
		datesList.push({
			date: new Date(currentDate).toISOString().split('T')[0],
			events: [],
			weekIndex: 0,
		});
	}

	// Match each event with its date in the datesList
	for (const event of upcomingEvents) {
		const dateWithEvent = datesList.find((date) => date.date === event.date);
		if (dateWithEvent) {
			event.calendarDate = dateWithEvent;
			dateWithEvent.events.push(event);
		}
	}

	// Group the dates by week
	const weekList: CalendarDate[][] = [];
	const daysByWeek = 7;
	for (let i = 0; i < datesList.length; i += daysByWeek) {
		const week = datesList.slice(i, i + daysByWeek);
		week.forEach((date) => {
			date.weekIndex = i / 7;
		});
		weekList.push(week);
	}

	selectedEvent = upcomingEvents[0];
	selectedDate = selectedEvent.calendarDate!;

	// Get the first day of the selected week
	function getMonthAndYearOfFirstDayOfTheWeek(selectedDateDate: Date): string {
		const day = selectedDateDate.getUTCDay();
		const diff = (day === 0 ? -6 : 1) - day;
		const firstDayOfTheWeek = new Date(selectedDate.date);
		firstDayOfTheWeek.setDate(selectedDateDate.getUTCDate() + diff);

		return `${monthNames[firstDayOfTheWeek.getMonth()]} ${firstDayOfTheWeek.getFullYear()}`;
	}
	monthAndYear = getMonthAndYearOfFirstDayOfTheWeek(new Date(selectedDate.date));

	const datesSwiperParams: SwiperOptions = {
		grabCursor: true,
		centeredSlides: true,
		slidesPerView: 'auto',
		spaceBetween: 0,
		on: {
			transitionEnd: (swiper) => {
				if (!datesSwiper) {
					return;
				}

				const firstDateOfTheWeek = weekList[swiper.activeIndex][0];
				const firstDayOfTheWeek = new Date(firstDateOfTheWeek.date);
				monthAndYear = `${monthNames[firstDayOfTheWeek.getMonth()]} ${firstDayOfTheWeek.getFullYear()}`;
			},
		},
	};

	const upcomingEventsSwiperParams: SwiperOptions = {
		effect: 'coverflow',
		grabCursor: true,
		centeredSlides: true,
		slidesPerView: 'auto',
		slideToClickedSlide: true,
		touchReleaseOnEdges: true,
		coverflowEffect: {
			rotate: 50,
			stretch: 0,
			depth: 100,
			modifier: 1,
			slideShadows: true,
		},
		pagination: {
			el: '.swiper-pagination',
		},
		initialSlide: 3,
		on: {
			transitionEnd: () => {
				if (!upcomingEventsSwiper) {
					return;
				}

				selectedEvent = upcomingEvents[upcomingEventsSwiper.activeIndex];
				selectedDate = selectedEvent.calendarDate!;
				monthAndYear = getMonthAndYearOfFirstDayOfTheWeek(new Date(selectedDate.date));
				// const selectedDateDate = new Date(selectedDate.date);
				// monthAndYear = `${monthNames[selectedDateDate.getMonth()]} ${selectedDateDate.getFullYear()}`;

				datesSwiper.slideToLoop(selectedDate.weekIndex, DATES_SWIPE_SPEED_IN_MS);
			},
		},
	};

	onMount(async () => {
		datesSwiper = new Swiper('.dates-swiper', datesSwiperParams);
		upcomingEventsSwiper = new Swiper('.events-swiper', upcomingEventsSwiperParams);

		startFly = true;

		setTimeout(() => {
			upcomingEventsSwiper.slideTo(0, EVENTS_SWIPE_SPEED_IN_MS);
		}, 500);
	});
</script>

<main>
	<Header />

	<section>
		<h2>Próximos Eventos</h2>

		<div class="dates-row">
			<h4 class="month-and-year fade-in">{monthAndYear}</h4>
			<div class="dates-swiper swiper">
				<div class="swiper-wrapper fade-in">
					{#each weekList as week}
						<div class="swiper-slide week">
							{#each week as date}
								{@const dateDate = new Date(date.date)}
								{@const dayOfTheWeek = daysOfTheWeek[dateDate.getUTCDay()] || ''}
								{@const dayNumber = dateDate.getUTCDate() || ''}
								<div
									class="date {dayOfTheWeek.toLowerCase()}"
									class:today={date.date ===
										new Date().toISOString().split('T')[0]}
									class:selected-date={date === selectedDate}
								>
									<div class="day-of-the-week">
										{dayOfTheWeek}
									</div>
									<div class="day-number-container">
										<div class="day-number">
											{#if dayNumber === 1}
												{abbreviatedMonths[dateDate.getUTCMonth()]}
											{/if}
											{dayNumber}
										</div>
									</div>
									<div
										class="events"
										class:two-or-more={date.events.length >= 2}
									>
										{#each date.events as event}
											<button
												class="event"
												class:selected={event.index === selectedEvent.index}
												style="background-image: url('{event.imageLink}');"
												on:click={() =>
													upcomingEventsSwiper.slideTo(
														event.index,
														EVENTS_SWIPE_SPEED_IN_MS,
													)}
											></button>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div
			class="events-swiper swiper"
			class:fly-in={startFly}
		>
			<div class="swiper-wrapper">
				{#each upcomingEvents as event, index (index)}
					<div class="swiper-slide">
						<img
							src={event.imageLink}
							alt=""
						/>
					</div>
				{/each}
			</div>
			<div class="swiper-pagination"></div>
		</div>
	</section>

	<section style="display: none;">
		<h2>Invitación a Ministerio o Anuncios</h2>
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
			height: 100vh;
		}
	}

	.dates-row {
		background-color: var(--bs-gray-200);
		margin-left: max(-3rem, -6vw);
		margin-right: max(-3rem, -6vw);
		padding-top: 0.5rem;

		h4 {
			font-size: min(22px, 5vw);
			text-align: center;
			margin-bottom: 0.25rem;
		}
	}

	.dates-swiper {
		padding-block: 0.5rem;

		.week {
			width: min(458px, 101vw);
			height: auto;
			padding-inline: 0.25rem;
			display: flex;
			opacity: 1;
			transition: opacity 150ms linear;

			&.swiper-slide-active {
				border-inline: 1px solid rgba(0, 0, 0, 0.35);
			}

			&:not(.swiper-slide-active) {
				opacity: 0.25;
			}
		}

		.date {
			flex: 1;
			height: auto;
			padding: 8px 4px 6px;
			text-align: center;
			display: flex;
			flex-direction: column;
			gap: 4px;
			line-height: 1;
			align-items: center;
		}

		.selected-date {
			background-color: white;
			border-radius: 4px;
			box-shadow:
				0 4px 6px -1px rgb(0 0 0 / 0.1),
				0 2px 4px -2px rgb(0 0 0 / 0.1);
		}

		.day-of-the-week {
			font-size: 10px;
			opacity: 0.5;
		}

		.day-number-container {
			display: flex;
			align-items: baseline;
			font-size: min(1rem, 3.5vw);
			font-weight: bold;
		}

		.day-number {
			height: 2rem;
			aspect-ratio: 1;
			line-height: 28px;
			white-space: nowrap;
		}

		.today .day-number {
			border: 2px solid var(--bs-primary);
			border-radius: 100vmax;
			padding-inline: 4px;
		}

		.events {
			display: flex;
			justify-content: center;
			padding-inline: 2px;
			gap: 0.25rem;

			&.two-or-more .selected {
				outline: 2px solid var(--bs-primary);
			}
		}

		.event {
			width: 1.5rem;
			aspect-ratio: 1;
			background-size: contain;
			border: none;
		}
	}

	.events-swiper {
		margin-left: max(-3rem, -6vw);
		margin-right: max(-3rem, -6vw);
		padding-top: 1rem;
		padding-bottom: 50px;
		opacity: 0; // Will be overrode by .fly-in

		.swiper-slide {
			background-position: center;
			background-size: cover;
			width: 300px;
			height: 300px;
			overflow: hidden;
		}

		.swiper-slide img {
			display: block;
			width: 100%;
		}
	}

	@keyframes fly-in {
		0% {
			opacity: 0;
			transform: translateY(50px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.fly-in {
		animation: fly-in 1s ease-out forwards;
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
		animation: fadeIn 2s ease-in forwards;
	}
</style>
