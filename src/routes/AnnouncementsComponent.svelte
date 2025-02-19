<script lang="ts">
	import { faArrowDown, faArrowUp, faShare } from '@fortawesome/free-solid-svg-icons';
	import { Button } from '@sveltestrap/sveltestrap';
	import Fa from 'svelte-fa';
	import { fade } from 'svelte/transition';

	import type { Announcement } from '$lib/appTypes';
	import AnimateToCenterComponent from '$lib/components/AnimateToCenterComponent.svelte';

	export let announcementList: Announcement[];
</script>

<h2>Anuncios</h2>

<div class="announcements">
	{#each announcementList as announcement, index (index)}
		{@const toggle = () => (announcement.isSelected = !announcement.isSelected)}
		<AnimateToCenterComponent
			isSelected={announcement.isSelected}
			{toggle}
		>
			<div class="announcement">
				<div class="announcement-content">
					<img
						src={announcement.imageLink}
						alt="Anuncio"
					/>
					{#if announcement.isSelected}
						<div
							class="description"
							transition:fade={{
								duration: 500,
							}}
						>
							{@html announcement.description}
						</div>
					{/if}
				</div>
				<div class="footer">
					<Button
						size="sm"
						color="light"
					>
						<Fa icon={faShare} />
						<span>Compartir</span>
					</Button>
					<Button
						size="sm"
						color="primary"
						on:click={toggle}
					>
						<span>{announcement.isSelected ? 'Volver' : 'Ver más detalles'}</span>
						{#if announcement.isSelected}
							<Fa icon={faArrowDown} />
						{:else}
							<Fa icon={faArrowUp} />
						{/if}
					</Button>
				</div>
			</div>
		</AnimateToCenterComponent>
	{/each}
</div>

<style lang="scss">
	.announcements {
		padding-top: 1rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.announcement {
		img {
			width: 100%;
			aspect-ratio: 1;
		}

		.description {
			aspect-ratio: 1;
			background-color: rgba(255, 255, 255, 0.94);
			padding: 1rem;
			overflow-y: auto;
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

	.announcement-content {
		display: grid;

		> * {
			grid-column: 1;
			grid-row: 1;
		}
	}
</style>
