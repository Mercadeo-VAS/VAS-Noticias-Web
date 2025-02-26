<script lang="ts">
	import { page } from '$app/state';
	import { faShare } from '@fortawesome/free-solid-svg-icons';
	import { Button } from '@sveltestrap/sveltestrap';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import Swiper from 'swiper/bundle';
	import type { SwiperOptions } from 'swiper/types';
	import { Temporal } from 'temporal-polyfill';

	import { env } from '$env/dynamic/public';
	import appService from '$lib/appService';
	import type { CalendarDate, Event } from '$lib/appTypes';
	import { openSocialMediaModal } from '$lib/components/modal';
	import { showToast } from '$lib/components/toast';
	import type { PageData } from './$types';
	// TODO: *** Change from bundle to the specific modules ***
	import 'swiper/css/bundle';

	export let data: PageData;

	let { eventList, weekList } = data;

	const DATES_SWIPE_SPEED_IN_MS = 1000;
	const EVENTS_SWIPE_SPEED_IN_MS = 1000;

	let datesSwiper: Swiper;
	let upcomingEventsSwiper: Swiper;
	let selectedEvent: Event;
	let selectedCalendarDates: CalendarDate[] = [];
	let monthAndYear: string;
	let didSlideChangeFromEvents = false;
	let isDomReady = false;

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
	const abbreviatedDaysOfTheWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

	// Get the selected Event from the URL event param if indicated
	selectedEvent = eventList[0];
	const eventSlug = page.url.searchParams.get('evento');
	let shouldShowToast = false;
	if (eventSlug) {
		const eventFromURL = eventList.find((event) => event.slug === eventSlug);
		if (eventFromURL) {
			selectedEvent = eventFromURL;
		} else {
			console.error(`Evento '${eventSlug}' no encontrado`);
			shouldShowToast = true;
		}
	}
	$: if (shouldShowToast && isDomReady) {
		showToast('Evento no encontrado');
	}

	selectedEvent.isFooterVisible = true;
	selectedCalendarDates = selectedEvent.calendarDates!;

	// Get the first day of the selected week
	function getMonthAndYearString(calendarDate: CalendarDate) {
		const date = Temporal.PlainDate.from(calendarDate.dateString);
		return `${monthNames[date.month - 1]} ${date.year}`;
	}
	const weekIndex = selectedCalendarDates[0].weekIndex;
	const firstCalendarDateOfTheWeek = weekList[weekIndex][0];
	monthAndYear = getMonthAndYearString(firstCalendarDateOfTheWeek);

	const datesSwiperParams: SwiperOptions = {
		grabCursor: true,
		centeredSlides: true,
		slidesPerView: 'auto',
		spaceBetween: 0,
		on: {
			transitionEnd: (swiper) => {
				if (!datesSwiper || didSlideChangeFromEvents) {
					didSlideChangeFromEvents = false;
					return;
				}

				const firstCalendarDateOfTheWeek = weekList[swiper.activeIndex][0];
				monthAndYear = getMonthAndYearString(firstCalendarDateOfTheWeek);
			},
		},
	};

	let eventFooterVisibilityTimeout: ReturnType<typeof setTimeout>;

	function hideEventFooter() {
		selectedEvent.isFooterVisible = false;
		clearTimeout(eventFooterVisibilityTimeout);

		// Force Svelte reactivity
		eventList = eventList;
	}

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
		initialSlide:
			selectedEvent.index <= Math.floor(eventList.length / 2) ? eventList.length - 2 : 1,
		on: {
			transitionEnd: () => {
				if (!upcomingEventsSwiper) {
					return;
				}

				selectedEvent = eventList[upcomingEventsSwiper.activeIndex];
				selectedCalendarDates = selectedEvent.calendarDates!;
				monthAndYear = getMonthAndYearString(selectedCalendarDates[0]);
				didSlideChangeFromEvents = true;

				datesSwiper.slideToLoop(
					selectedCalendarDates[0].weekIndex,
					DATES_SWIPE_SPEED_IN_MS,
				);

				// Show the event footer after a delay
				eventFooterVisibilityTimeout = setTimeout(() => {
					selectedEvent.isFooterVisible = true;

					// Force Svelte reactivity
					eventList = eventList;
				}, 500);
			},
			sliderFirstMove: hideEventFooter,
			slideChangeTransitionStart: hideEventFooter,
		},
	};

	onMount(async () => {
		datesSwiper = new Swiper('.dates-swiper', datesSwiperParams);
		upcomingEventsSwiper = new Swiper('.events-swiper', upcomingEventsSwiperParams);

		isDomReady = true;

		setTimeout(() => {
			upcomingEventsSwiper.slideTo(selectedEvent.index, EVENTS_SWIPE_SPEED_IN_MS * 2);
		}, 500);
	});
</script>

<section class="upcoming-events">
	<div class="dates-row">
		<h4 class="month-and-year fade-in">{monthAndYear}</h4>
		<div class="swiper dates-swiper">
			<div class="swiper-wrapper fade-in">
				{#each weekList as week}
					<div class="swiper-slide week">
						{#each week as calendarDate}
							{@const date = Temporal.PlainDate.from(calendarDate.dateString)}
							{@const dayOfTheWeek = abbreviatedDaysOfTheWeek[date.dayOfWeek - 1]}
							{@const dayNumber = date.day}
							<div
								class="date {dayOfTheWeek.toLowerCase()}"
								class:today={calendarDate.dateString ===
									Temporal.Now.plainDateISO().toString()}
								class:selected={selectedCalendarDates.includes(calendarDate)}
							>
								<div class="day-of-the-week">
									{dayOfTheWeek}
								</div>
								<div class="day-number-container">
									<div class="day-number">
										{#if dayNumber === 1}
											{abbreviatedMonths[date.month - 1]}
										{/if}
										{dayNumber}
									</div>
								</div>
								<div class="events">
									{#each calendarDate.events as event}
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
		class="swiper events-swiper"
		class:fly-in={isDomReady}
	>
		<div class="swiper-wrapper">
			{#each eventList as event, index (index)}
				<div class="swiper-slide">
					<div
						class="card-container"
						class:flipped={event.isFlipped}
						class:front-side-visible={event.showFrontSide}
					>
						<!-- The front side is the text content. Only this way the text can be scrolled. -->
						<div class="front side">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							<div class="content">{@html event.description}</div>
							<div
								class="footer"
								class:visible={event.isFooterVisible}
							>
								<Button
									size="sm"
									color="light"
									on:click={() =>
										openSocialMediaModal(
											`${env.PUBLIC_SHARE_LINK_BASE}/eventos?evento=${selectedEvent.slug}`,
										)}
								>
									<Fa icon={faShare} />
									<span>Compartir</span>
								</Button>
								<Button
									size="sm"
									color="primary"
									on:click={() => {
										event.isFlipped = true;
										setTimeout(() => {
											event.showFrontSide = false;
										}, 1500);
									}}
								>
									<span>Volver</span>
									<img
										src="/icons/rotate-180-icon.svg"
										alt=""
									/>
								</Button>
							</div>
						</div>

						<div class="front-bg side">
							<!-- This footer ensures the backface of the other footer is covered with a white background. -->
							<div class="footer" />
						</div>

						<!-- The back side is the event image. The card starts flipped. -->
						<div class="back side">
							<img
								class="event-image"
								src={event.imageLink}
								alt="Evento"
							/>
							<div
								class="footer"
								class:visible={event.isFooterVisible}
							>
								<Button
									size="sm"
									color="light"
									on:click={() =>
										openSocialMediaModal(
											`${env.PUBLIC_SHARE_LINK_BASE}/eventos?evento=${selectedEvent.slug}`,
										)}
								>
									<Fa icon={faShare} />
									Compartir
								</Button>
								<Button
									size="sm"
									color="primary"
									on:click={() => {
										event.isFlipped = false;
										event.showFrontSide = true;
									}}
								>
									Ver más detalles
									<img
										src="/icons/rotate-180-icon.svg"
										alt=""
									/>
								</Button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="swiper-pagination"></div>
	</div>
</section>

<svelte:head>
	{#if eventSlug}
		<meta
			property="og:description"
			content={appService.stripHTMLTags(selectedEvent.description)}
		/>
		<meta
			property="og:image"
			content="{env.PUBLIC_SHARE_LINK_BASE}/{selectedEvent.imageLink}"
		/>
		<meta
			property="og:url"
			content="{env.PUBLIC_SHARE_LINK_BASE}?evento={selectedEvent.slug}"
		/>
	{/if}
</svelte:head>

<style lang="scss">
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
			width: min(486px, 101vw);
			height: auto;
			padding-inline: 6px;
			display: flex;
			gap: 0.25rem;
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

			&.selected {
				background-color: white;
				border-radius: 4px;
				box-shadow:
					0 4px 6px -1px rgb(0 0 0 / 0.1),
					0 2px 4px -2px rgb(0 0 0 / 0.1);
			}
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

			.selected {
				box-shadow: 0 0 0 1px var(--bs-white) inset;
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
		$img-size: 300px;
		$footer-height: 40px;

		margin-left: max(-3rem, -6vw);
		margin-right: max(-3rem, -6vw);
		padding-top: 1rem;
		padding-bottom: 50px + $footer-height;
		opacity: 0; // Will be overrode by .fly-in

		.swiper-slide {
			width: $img-size;
			height: $img-size;
		}

		.card-container {
			transition: 1.5s ease-in-out;
			transform-style: preserve-3d;
			height: 100%;

			&.flipped {
				transform: rotateY(-180deg);
			}
		}

		.side {
			position: absolute;
			inset: 0;
		}

		.front {
			z-index: 2;
			display: none;
			transform: translateZ(50px) scale(0.95832);
			backface-visibility: hidden;

			.content {
				$padding-bottom: 2rem;
				padding: 1rem;
				padding-bottom: $padding-bottom;
				height: $img-size;
				line-height: 1.4;
				overflow-y: auto;
				overflow-x: hidden;
				position: relative;

				&::after {
					content: '';
					position: fixed;
					inset: 0;
					height: $padding-bottom;
					margin-top: auto;
					background: linear-gradient(transparent, white);
					transform: translateY(1px);
				}
			}

			.footer {
				height: $footer-height;
				display: flex;
				align-items: center;
				justify-content: space-between;
				opacity: 0;
				transition: opacity 1.5s ease;
			}
		}

		.front-bg {
			z-index: 1;
			background-color: rgba(255, 255, 255, 0.9);
			transform: translateZ(0.08px) scale(1.003);

			.footer {
				width: 100%;
				height: $footer-height + 2px;
				position: absolute;
				bottom: -$footer-height;
				background-color: white;
			}
		}

		.back {
			background-color: transparent;
			transform: rotateY(180deg);

			.event-image {
				width: 100%;
				aspect-ratio: 1;
			}

			.footer {
				height: $footer-height;
				background-color: var(--app-primary-light);
				padding-inline: 0.25rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom-left-radius: 4px;
				border-bottom-right-radius: 4px;
				opacity: 0;
				transition: opacity 1.5s ease;
			}
		}

		.footer.visible {
			opacity: 1;
		}

		.front-side-visible .front {
			display: block;
		}

		.footer img {
			width: 1.5rem;
			margin: -4px -2px -2px 0px;
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
