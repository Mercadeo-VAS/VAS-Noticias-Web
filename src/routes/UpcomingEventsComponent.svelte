<script lang="ts">
	import { page } from '$app/stores';
	import { faShare } from '@fortawesome/free-solid-svg-icons';
	import { Button } from '@sveltestrap/sveltestrap';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import Swiper from 'swiper/bundle';
	import type { SwiperOptions } from 'swiper/types';

	import appService from '$lib/appService';
	import { openSocialMediaModal } from '$lib/components/modal';
	import { showToast } from '$lib/components/toast';
	// TODO: *** Change from bundle to the specific modules ***
	import 'swiper/css/bundle';
	import '../styles/main.scss';

	// Type for the dates in the Dates Swiper
	type CalendarDate = {
		date: string;
		events: Event[];
		weekIndex: number;
	};

	// Type for the Events in the Events Swiper
	type Event = {
		index: number;
		slug: string;
		imageLink: string;
		dates: string[];
		calendarDates?: CalendarDate[];
		description: string;
		isFooterVisible?: boolean;
		isFlipped?: boolean;
		showBackSide?: boolean;
	};

	const DATES_SWIPE_SPEED_IN_MS = 1000;
	const EVENTS_SWIPE_SPEED_IN_MS = 1000;
	const SHARE_LINK_BASE = 'https://vas-noticias.netlify.app/';

	let datesSwiper: Swiper;
	let upcomingEventsSwiper: Swiper;
	let selectedEvent: Event;
	let selectedDates: CalendarDate[] = [];
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
	const daysOfTheWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

	// TODO: Validate that that the date format is 'yyyy-mm-dd'. If day, for example, is just `d` instead of `dd`, it will cause an error.
	let upcomingEvents: Event[] = [
		{
			index: 0,
			slug: 'ensenanza-conflicto-actual-con-origenes-biblicos-isaac-e-ismael',
			imageLink: 'images/Enseñanza - Isaac e Ismael.jpg',
			dates: ['2024-11-09', '2024-11-10'],
			description: `Este 9 y 10 de noviembre continuaremos con la serie: «Conflicto en medio oriente», ahora con el tema, Isaac e Ismael y compartiremos acerca de lo que la Biblia enseña sobre el judaísmo, los musulmanes y el cristianismo. Es de vital importancia conocer el origen de nuestra fe y sobre todo, porque creemos que Jesús y solamente Jesús es el único camino al Padre. Ven con tus amigos, invita a tus familiares.`,
		},
		{
			index: 1,
			slug: 'evento-disfrutando-amando-y-sonriendo',
			imageLink: 'images/Evento - Disfrutando, amando y sonriendo.jpg',
			dates: ['2024-11-15'],
			description: `<p>
					En la vida matrimonial afrontamos importantes desafíos. Fortalecer esta unión desde los primeros años nos permitirá construir sobre cimientos firmes.
				</p>
				<p>
					Si tenés entre 0 y 5 años de casados, te invitamos a continuar estrechando los lazos matrimoniales a través del tema: Disfrutando, amando y sonriendo.
				</p>
				<p>
					Te esperamos en esta actividad diseñada para matrimonios jóvenes.
				</p>
				<p>
					Próximo viernes 15 de noviembre, a las 7:15 p.m., en VAS.
				</p>
				<p>
					Inscribite antes del 13 de noviembre y disfrutá de un espacio para compartir experiencias.
				</p>
				<p>
					Inscripción en el siguiente link. <br />
					<a href="https://forms.gle/CGduBTBdbSMkSJ577" target="_blank">https://forms.gle/CGduBTBdbSMkSJ577</a>
				</p>
				<p>
					Información: matrimonios@vas.cr 6418-5055. <br />
					Actividad gratuita.
				</p>`,
		},
		{
			index: 2,
			slug: 'taller-la-navidad-empieza-con-cristo',
			imageLink: 'images/Taller - La Navidad Empieza con Cristo.jpg',
			dates: ['2024-11-16'],
			description: `
				<p>
					La Navidad empieza con Cristo, acompáñanos a inaugurar esta hermosa temporada y recordar que Jesús es el centro de nuestras vidas, te invitamos al taller de Tiempo Creativo con Dios, ven y comparte con nosotros, aprende sobre bisutería y scrapbook. Celebremos la navidad junto a Jesús.
				</p>
				<p>
					🗓️16 Noviembre <br />
					📞 8493-3636
				</p>`,
		},
		{
			index: 3,
			slug: 'evento-hombres-gratitud',
			imageLink: 'images/Evento - Gratitud.jpg',
			dates: ['2024-11-30'],
			description: `
				<p>
					El Ministerio de Hombres VAS te invita a un espacio en el que reflexionaremos sobre la gratitud, y en el que le agradeceremos a Dios por su misericordia y fidelidad en nuestras vidas.
				</p>
				<p>
					Apartá la fecha: sábado 30 de noviembre, de 10 a. m. a 2 p.m. La inversión es de 6 mil colones. Incluye una deliciosa parrillada y otras sorpresas.
				</p>
				<p>
					Sinpe: 8385-6002.
				</p>`,
		},
		{
			index: 4,
			slug: 'encuentro-matrimonial-acercate-a-mi',
			imageLink: 'images/Encuentro Matrimonial - Acércate a mí.jpg',
			dates: ['2025-03-28', '2025-03-29', '2025-03-30'],
			description: `
				<p>
					Volvamos a encontrarnos y a sonreír juntos, con esas cosas que un día nos unieron.
				</p>
				<p>
					Es tiempo de levantarnos y de construir.
				</p>
				<p>
					Encuentro matrimonial “Arcercate a mí”.
				</p>
				<p>
					28, 29 y 30 Marzo, 2025.
				</p>
				<p>
					Reservá la fecha.
				</p>
				<p>
					<i>“Sobre todo, vístanse de amor, lo cual nos une a todos en perfecta armonía”</i>. <br />
					<b>Colosenses: 3:14</b>
				</p>
			`,
		},
		// 		{
		// 			index: 0,
		// 			slug: 'emociones-que-matan',
		// 			imageLink: 'images/Live - Emociones que matan.jpg',
		// 			dates: ['2024-08-28'],
		// 			description: 'Los invitamos al programa Hablemos, con el Pastor Marco Vega y Fio',
		// 		},
		// 		{
		// 			index: 1,
		// 			slug: 'taller-autolesiones-y-la-conducta-suicida',
		// 			imageLink: 'images/Evento - Taller.jpg',
		// 			dates: ['2024-09-07'],
		// 			description:
		// 				'Te invitamos al taller: “Comprendiendo a el dolor , la realidad detrás de las autolesiones y la conducta suicida”; donde conocerás como prevenir situaciones de riesgo de autolesiones, factores de riesgo, señales de alerta, detonantes, primeros auxilios psicológicos.',
		// 		},
		// 		{
		// 			index: 2,
		// 			slug: 'feria-empresarial-kids',
		// 			imageLink: 'images/Evento - Feria Empresarial Kids.jpg',
		// 			dates: ['2024-09-07', '2024-09-08'],
		// 			description:
		// 				'Si eres un niño entre 4 a 11años y  tienes un emprendimiento el Ministerio de Excelencia te invita a participar en nuestra Feria Empresarial Kids a realizarse los días 7 y 8 de setiembre, para inscripciones contactar a Mariana Garro cel.8986-0649',
		// 		},
		// 		{
		// 			index: 3,
		// 			slug: 'curso-te-vuelvo-a-elegir',
		// 			imageLink: 'images/Curso - Te vuelvo a elegir.jpg',
		// 			dates: ['2024-10-05', '2024-10-12', '2024-10-19'],
		// 			description: `Curso Te Vuelvo a Elegir
		// ¿Deseas poner en orden tu vida matrimonial?
		// ¿Están en unión libre o solo casados por lo civil?
		//  Los invitamos a ser parte del curso "Te vuelvo a elegir"
		//  Los sábados 5-12-19 octubre, en horario de 8 am a 1 pm
		// Requisitos:
		// •⁠  ⁠Que ambos estén presentes los 3 sábados
		// •⁠  ⁠Estar ambos en libertad de estado, para recibir la bendición del Señor por medio del pastor.
		// Inversión ¢ 50.000.00 por pareja; incluye desayuno, materiales, expositores y más detalles.
		// Sean parte de esta maravillosa experiencia en donde se compartirá y recibirán muchas herramientas para disfrutar la maravillosa aventura del matrimonio.
		// Para inscripción o más información pueden escribir al 6418-5055
		// https://forms.gle/39rHw2ERcf5XRUdt6`,
		// 		},
		// 		{
		// 			index: 4,
		// 			slug: 'curso-prematrimonial',
		// 			imageLink: 'images/Curso - Prematrimonial.jpg',
		// 			dates: ['2024-10-05', '2024-10-12', '2024-10-19'],
		// 			description: `Curso Prematrimonial VAS
		// Dirigido a parejas de novios que no viven juntos y que este será su primer matrimonio.
		// Los sábados 5-12-19 de octubre en horario de 8 am a 1 pm.
		// Requisitos: que ambos estén presentes los 3 sábados.
		// Fecha límite de inscripción 30 de Setiembre.
		// Inversión ¢ 50.000.00 por pareja.
		// Incluye desayuno, materiales, detalles, expositores y certificado.
		// Nuestro curso es una oportunidad para recibir herramientas y consejos para construir un matrimonio saludable.
		// Para más información pueden escribir al 7208-4652 con Yanerys Castro
		// https://forms.gle/9vCzbFpu7KfgYGki7`,
		// 		},
	];

	/**
	 * Generate a list of dates from the min and max dates in the events list
	 */

	const today = new Date();
	const eventDates = upcomingEvents
		.flatMap((event) => event.dates.map((date) => new Date(date).getTime()))
		.concat(today.getTime());
	const minDate = new Date(Math.min(...eventDates));
	const maxDate = new Date(Math.max(...eventDates));

	// Get previous Monday from the minDate
	const minDateDay = minDate.getUTCDay();
	const daysToSubtract = (minDateDay + 6) % 7;
	const previousMonday = new Date(minDate);
	previousMonday.setDate(minDate.getUTCDate() - daysToSubtract);

	// Get next Sunday from maxDate
	const maxDateDay = maxDate.getUTCDay();
	const daysToAdd = (7 - maxDateDay) % 7;
	const nextSunday = new Date(maxDate);
	nextSunday.setDate(maxDate.getUTCDate() + daysToAdd);

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
		event.calendarDates = [];
		for (const eventDate of event.dates) {
			const dateWithEvent = datesList.find((date) => date.date === eventDate);
			if (dateWithEvent) {
				event.calendarDates.push(dateWithEvent);
				dateWithEvent.events.push(event);
			}
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

	// Get selected Event from the URL event param if indicated
	selectedEvent = upcomingEvents[0];
	const eventSlug = $page.url.searchParams.get('evento');
	let shouldShowToast = false;
	if (eventSlug) {
		const eventFromURL = upcomingEvents.find((event) => event.slug === eventSlug);
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
	selectedDates = selectedEvent.calendarDates!;

	// Get the first day of the selected week
	function getMonthAndYearOfFirstDayOfTheWeek(selectedDateDate: Date): string {
		const day = selectedDateDate.getUTCDay();
		const diff = (day === 0 ? -6 : 1) - day;
		const firstDayOfTheWeek = new Date(selectedDateDate);
		firstDayOfTheWeek.setDate(selectedDateDate.getUTCDate() + diff);

		return `${monthNames[firstDayOfTheWeek.getMonth()]} ${firstDayOfTheWeek.getFullYear()}`;
	}
	monthAndYear = getMonthAndYearOfFirstDayOfTheWeek(new Date(selectedEvent.dates[0]));

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

				const firstDateOfTheWeek = weekList[swiper.activeIndex][0];
				const firstDayOfTheWeek = new Date(firstDateOfTheWeek.date);
				monthAndYear = `${monthNames[firstDayOfTheWeek.getMonth()]} ${firstDayOfTheWeek.getFullYear()}`;
			},
		},
	};

	let eventFooterVisibilityTimeout: ReturnType<typeof setTimeout>;

	function hideEventFooter() {
		selectedEvent.isFooterVisible = false;
		clearTimeout(eventFooterVisibilityTimeout);

		// Force Svelte reactivity
		upcomingEvents = upcomingEvents;
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
		initialSlide: upcomingEvents.length - 2,
		on: {
			transitionEnd: () => {
				if (!upcomingEventsSwiper) {
					return;
				}

				selectedEvent = upcomingEvents[upcomingEventsSwiper.activeIndex];
				selectedDates = selectedEvent.calendarDates!;
				const firstSelectedDateDate = new Date(selectedDates[0].date);
				monthAndYear = `${monthNames[firstSelectedDateDate.getMonth()]} ${firstSelectedDateDate.getFullYear()}`;
				didSlideChangeFromEvents = true;

				datesSwiper.slideToLoop(selectedDates[0].weekIndex, DATES_SWIPE_SPEED_IN_MS);

				// Show the event footer after a delay
				eventFooterVisibilityTimeout = setTimeout(() => {
					selectedEvent.isFooterVisible = true;

					// Force Svelte reactivity
					upcomingEvents = upcomingEvents;
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
							class:today={date.date === new Date().toISOString().split('T')[0]}
							class:selected={selectedDates.includes(date)}
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
							<div class="events">
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
	class:fly-in={isDomReady}
>
	<div class="swiper-wrapper">
		{#each upcomingEvents as event, index (index)}
			<div class="swiper-slide">
				<div
					class="card-container"
					class:flipped={event.isFlipped}
					class:back-side-visible={event.showBackSide}
				>
					<div class="front side">
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
									openSocialMediaModal({
										shareLink: `${SHARE_LINK_BASE}?evento=${selectedEvent.slug}`,
									})}
							>
								<Fa icon={faShare} />
								Compartir
							</Button>
							<Button
								size="sm"
								color="primary"
								on:click={() => (event.isFlipped = event.showBackSide = true)}
							>
								Ver más detalles
								<img
									src="/icons/rotate-180-icon.svg"
									alt=""
								/>
							</Button>
						</div>
					</div>

					<div class="back-bg side">
						<div class="footer" />
					</div>

					<div class="back side">
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
									openSocialMediaModal({
										shareLink: `${SHARE_LINK_BASE}?evento=${selectedEvent.slug}`,
									})}
							>
								<Fa icon={faShare} />
								Compartir
							</Button>
							<Button
								size="sm"
								color="primary"
								on:click={() => {
									event.isFlipped = false;
									setTimeout(() => {
										event.showBackSide = false;
									}, 1500);
								}}
							>
								Volver
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

<svelte:head>
	{#if eventSlug}
		<meta
			property="og:description"
			content={appService.stripHTMLTags(selectedEvent.description)}
		/>
		<meta
			property="og:image"
			content={SHARE_LINK_BASE + selectedEvent.imageLink}
		/>
		<meta
			property="og:url"
			content="{SHARE_LINK_BASE}?evento={selectedEvent.slug}"
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
				transform: rotateY(180deg);
			}
		}

		.side {
			position: absolute;
			inset: 0;
		}

		.front {
			z-index: 2;

			.event-image {
				width: 100%;
				aspect-ratio: 1;
			}

			.footer {
				height: $footer-height;
				background-color: rgba(var(--bs-primary-rgb), 0.15);
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

		.back-bg {
			z-index: 1;
			background-color: rgba(255, 255, 255, 0.9);
			transform: translatez(-0.06px) scale(1.002);

			.footer {
				width: 100%;
				height: $footer-height + 2px;
				position: absolute;
				bottom: -$footer-height;
				background-color: white;
			}
		}

		.back {
			display: none;
			transform: rotateY(180deg);
			background-color: transparent;
			transform: translatez(-50px) scale(0.95832) rotateY(180deg);
			backface-visibility: hidden;

			.content {
				$padding-bottom: 32px;
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

		.footer.visible {
			opacity: 1;
		}

		.back-side-visible .back {
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
