<script lang="ts">
	import { faArrowDown, faArrowUp, faShare } from '@fortawesome/free-solid-svg-icons';
	import { Button } from '@sveltestrap/sveltestrap';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { fade, fly } from 'svelte/transition';

	import { env } from '$env/dynamic/public';
	import type { Announcement } from '$lib/appTypes';
	import AnimateToCenterComponent from '$lib/components/AnimateToCenterComponent.svelte';
	import { openSocialMediaModal } from '$lib/components/modal';
	import type { PageData } from '../anuncios/$types';

	export let data: PageData;

	const { announcementList } = data;

	let announcements: Announcement[] = [];

	onMount(() => {
		announcements = announcementList;
	});
</script>

<section class="">
	<div class="sticky-top-scroll-shadow" />
	<div class="announcements">
		{#each announcements as announcement, index (index)}
			{@const toggle = () => (announcement.isSelected = !announcement.isSelected)}
			<div in:fly={{ x: 200, duration: 1000, delay: 200 * index }}>
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
										`${env.PUBLIC_SHARE_LINK_BASE}?anuncio=${announcement.slug}`,
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
									>{announcement.isSelected ? 'Volver' : 'Ver más detalles'}</span
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
</section>

<style lang="scss">
	section {
		flex: 1;
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
