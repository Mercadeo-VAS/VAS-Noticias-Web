<script lang="ts">
	import { onMount } from 'svelte';
	import Swiper from 'swiper/bundle';
	import type { SwiperOptions } from 'swiper/types';

	import Header from './Header.svelte';

	import 'swiper/css/bundle'; // TODO: *** Change from bundle to the specific modules ***
	import '../styles/main.scss';

	type Event = {
		id: number;
		imageLink: string;
		date: string;
	};

	type CalendarDate = { date: Date; events: Event[] };

	let datesSwiper: Swiper;
	let upcomingEventsSwiper: Swiper;
	let selectedEvent: Event;
	let startFly = false;

	const datesSwiperParams: SwiperOptions = {
		grabCursor: true,
		centeredSlides: true,
		slidesPerView: 'auto',
		spaceBetween: 4,
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
			touchEnd: () => {
				console.log('activeIndex', upcomingEventsSwiper.activeIndex);
				selectedEvent = upcomingEvents[upcomingEventsSwiper.activeIndex];
				const eventDate = selectedEvent.date;
				const dateIndex = datesList.findIndex(
					(date) =>
						date.date.toISOString().split('T')[0] ===
						new Date(eventDate).toISOString().split('T')[0],
				)!;
				datesSwiper.slideTo(dateIndex, 1000);
			},
		},
	};

	const daysOfTheWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

	const upcomingEvents: Event[] = [
		{
			id: 1,
			imageLink: 'images/Live - Emociones que matan.jpg',
			date: '2024-08-28',
		},
		{
			id: 2,
			imageLink: 'images/Evento - Taller.jpg',
			date: '2024-09-07',
		},
		{
			id: 3,
			imageLink: 'images/Evento - Feria Empresarial Kids.jpg',
			date: '2024-09-7',
		},
		{
			id: 4,
			imageLink: 'images/Curso - Te vuelvo a elegir.jpg',
			date: '2024-10-05',
		},
		{
			id: 5,
			imageLink: 'images/Curso - Prematrimonial.jpg',
			date: '2024-10-5',
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
	let datesList: CalendarDate[] = [];
	for (
		let currentDate = new Date(minDate);
		currentDate <= maxDate;
		currentDate.setDate(currentDate.getDate() + 1)
	) {
		datesList.push({ date: new Date(currentDate), events: [] });
	}

	// Match each event with its date in the datesList
	for (const event of upcomingEvents) {
		const dateWithEvent = datesList.find(
			(date) =>
				date.date.toISOString().split('T')[0] ===
				new Date(event.date).toISOString().split('T')[0],
		)!;

		dateWithEvent.events.push(event);
	}

	selectedEvent = upcomingEvents[0];

	onMount(async () => {
		datesSwiper = new Swiper('.datesSwiper', datesSwiperParams);
		upcomingEventsSwiper = new Swiper('.eventsSwiper', upcomingEventsSwiperParams);

		startFly = true;

		setTimeout(() => {
			upcomingEventsSwiper.slideTo(0, 1500);
		}, 500);
	});
</script>

<main>
	<Header />

	<section>
		<h2>Próximos Eventos</h2>

		<div class="datesSwiper swiper">
			<div class="swiper-wrapper fade-in">
				{#each datesList as date, index (index)}
					<div
						class="swiper-slide"
						class:today={date.date.toISOString().split('T')[0] ===
							new Date().toISOString().split('T')[0]}
						class:has-events={date.events.length}
					>
						<div class="day-of-the-week">{daysOfTheWeek[date.date.getUTCDay()]}</div>
						<div class="day-number">{date.date.getUTCDate()}</div>
						<div class="events">
							{#each date.events as event}
								<div
									class="event"
									class:selected={event.id === selectedEvent.id}
									style="background-image: url('{event.imageLink}');"
								></div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div
			class="eventsSwiper swiper"
			class:fly-in={startFly}
		>
			<div class="swiper-wrapper">
				{#each upcomingEvents as event, index (index)}
					<div class="swiper-slide">
						<img
							id="image{index}"
							src={event.imageLink}
							alt=""
						/>
					</div>
				{/each}
			</div>
			<div class="swiper-pagination"></div>
		</div>
	</section>

	<section>
		<h2>Invitación a Ministerio</h2>
	</section>
</main>

<style lang="scss">
	main {
		margin: 1rem auto;
		max-width: 902px;
		background-color: white;
		padding: 2rem 3rem;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	.datesSwiper {
		background-color: var(--bs-gray-200);
		margin-left: -3rem;
		margin-right: -3rem;
		padding-block: 0.5rem;

		.swiper-slide {
			width: 4rem;
			padding: 8px 4px 6px;
			text-align: center;
			display: flex;
			flex-direction: column;
			gap: 4px;
			line-height: 1;
			align-items: center;
		}

		:global(.swiper-slide-active.has-events) {
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

		.day-number {
			width: 2rem;
			aspect-ratio: 1;
			line-height: 27px;
			font-weight: bold;
		}

		.today .day-number {
			border: 2px solid var(--bs-primary);
			border-radius: 100vmax;
		}

		.events {
			display: flex;
			justify-content: center;
			gap: 6px;
		}

		.event {
			width: 1.5rem;
			aspect-ratio: 1;
			background-size: contain;

			&.selected {
				box-shadow: 0 0 4px 2px var(--bs-gray);
			}
		}
	}

	.eventsSwiper {
		margin-left: -2rem;
		margin-right: -2rem;
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
