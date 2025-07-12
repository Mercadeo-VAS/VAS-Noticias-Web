<script lang="ts">
	import { page } from '$app/state';
	import { faArrowDown, faArrowUp, faShare } from '@fortawesome/free-solid-svg-icons';
	import { Button } from '@sveltestrap/sveltestrap';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { fade, fly } from 'svelte/transition';

	import { PUBLIC_SHARE_LINK_BASE } from '$env/static/public';
	import appService from '$lib/appService';
	import type { Announcement } from '$lib/appTypes';
	import AnimateToCenterComponent from '$lib/components/AnimateToCenterComponent.svelte';
	import NoContentPlaceholderComponent from '$lib/components/NoContentPlaceholderComponent.svelte';
	import { openSocialMediaModal } from '$lib/components/modal';
	import { showToast } from '$lib/components/toast';
	import type { PageData } from '../anuncios/$types';

	export let data: PageData;

	const { announcementList } = data;

	let announcements: Announcement[] = [];
	let isDomReady = false;
	let announcementsFlyDuration = 1000;
	let announcementsFlyDelay = 200;

	// Get the selected Announcement from the URL announcement param if indicated
	const announcementSlug = page.url.searchParams.get('anuncio');
	let selectedAnnouncement: Announcement | undefined;
	let shouldShowToast = false;
	if (announcementSlug) {
		const announcementFromURL = announcementList.find(
			(announcement) => announcement.slug === announcementSlug,
		);
		if (announcementFromURL) {
			selectedAnnouncement = announcementFromURL;
		} else {
			console.error(`Anuncio '${announcementSlug}' no encontrado`);
			shouldShowToast = true;
		}
	}
	$: if (shouldShowToast && isDomReady) {
		showToast('Anuncio no encontrado');
	}

	onMount(() => {
		announcements = announcementList;
		isDomReady = true;

		// Open the selected announcement after all the announcements are transitioned
		if (selectedAnnouncement) {
			setTimeout(
				() => {
					if (announcements[selectedAnnouncement.index]) {
						announcements[selectedAnnouncement.index].isSelected = true;
					}
				},
				announcementsFlyDelay * announcements.length + announcementsFlyDuration,
			);
		}
	});
</script>

<section>
	{#if announcementList.length}
		<div class="announcements-wrapper">
			<div class="sticky-top-scroll-shadow" />
			<div class="announcements">
				{#each announcements as announcement, index (index)}
					{@const toggle = () => (announcement.isSelected = !announcement.isSelected)}
					<div
						in:fly={{
							x: 200,
							duration: announcementsFlyDuration,
							delay: announcementsFlyDelay * index,
						}}
					>
						<AnimateToCenterComponent
							isSelected={announcement.isSelected}
							{toggle}
						>
							<div
								class="announcement"
								class:selected={announcement.isSelected}
							>
								<img
									src={announcement.imageLink}
									alt="Anuncio"
								/>
								<div class="description-container">
									<div
										class="description"
										transition:fade={{
											duration: 500,
										}}
									>
										{@html announcement.description}
									</div>
								</div>
								<div class="footer">
									<Button
										size="sm"
										color="light"
										on:click={() =>
											openSocialMediaModal(
												`${PUBLIC_SHARE_LINK_BASE}/anuncios?anuncio=${announcement.slug}`,
											)}
									>
										<Fa icon={faShare} />
										<span>Compartir</span>
									</Button>
									<Button
										size="sm"
										color="primary"
										on:click={toggle}
									>
										<span
											>{announcement.isSelected
												? 'Volver'
												: 'Ver más detalles'}</span
										>
										{#if announcement.isSelected}
											<Fa icon={faArrowDown} />
										{:else}
											<Fa icon={faArrowUp} />
										{/if}
									</Button>
								</div>
							</div>
						</AnimateToCenterComponent>
					</div>
				{/each}
			</div>
			<div class="sticky-bottom-scroll-shadow" />
		</div>
	{:else}
		<NoContentPlaceholderComponent
			message="No hay anuncios esta semana."
			cardTitle="¿Qué son los anuncios?"
			cardDescription="Los anuncios son comunicados que no tienen fecha ni hora. A diferencia de los eventos, no ocurren en un momento específico. Por ejemplo, un anuncio de un ministerio que invita a unirse a su ministerio."
		/>
	{/if}
</section>

<svelte:head>
	{#if announcementSlug && selectedAnnouncement}
		<meta
			property="og:description"
			content={appService.stripHTMLTags(selectedAnnouncement.description)}
		/>
		<meta
			property="og:image"
			content="{PUBLIC_SHARE_LINK_BASE}/{selectedAnnouncement.imageLink}"
		/>
		<meta
			property="og:url"
			content="{PUBLIC_SHARE_LINK_BASE}/anuncios?anuncio={selectedAnnouncement.slug}"
		/>
	{/if}
</svelte:head>

<style lang="scss">
	section {
		flex: 1;
	}

	.announcements-wrapper {
		margin-inline: max(-3rem, -6vw);
		padding-inline: min(3rem, 6vw);
		overflow-y: auto;
		overflow-x: hidden;
		position: relative;
		margin-top: -1rem;
	}

	.sticky-top-scroll-shadow {
		height: 2rem;
		background: linear-gradient(white, transparent);
		position: sticky;
		top: 0;
	}

	.sticky-bottom-scroll-shadow {
		height: 3rem;
		background: linear-gradient(transparent, white 90%);
		position: sticky;
		bottom: 0;
		pointer-events: none;
	}

	.announcements {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;

		@media (min-width: 769px) {
			grid-template-columns: repeat(auto-fit, minmax(300px, 0.5fr));
		}
	}

	.announcement {
		img {
			width: 100%;
			aspect-ratio: 1;
		}

		.description-container {
			display: grid;
			grid-template-rows: 0fr;
			padding: 0;
			padding-inline: 1rem;
			transition:
				grid-template-rows 750ms ease,
				padding 750ms;
			background-color: white;
		}

		.description {
			overflow: hidden;
			line-height: 1.4;
		}

		&.selected .description-container {
			grid-template-rows: 1fr;
			padding: 1rem;
		}

		.footer {
			height: 40px;
			background-color: var(--app-primary-light);
			padding-inline: 0.25rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom-left-radius: 4px;
			border-bottom-right-radius: 4px;

			img {
				width: 1.5rem;
				margin: -4px -2px -2px 0px;
			}
		}
	}
</style>
