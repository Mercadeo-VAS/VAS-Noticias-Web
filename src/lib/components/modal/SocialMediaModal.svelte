<script lang="ts">
	import {
		faFacebookF,
		faTelegramPlane,
		faWhatsapp,
		faXTwitter,
	} from '@fortawesome/free-brands-svg-icons';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import {
		Button,
		Input,
		InputGroup,
		Modal,
		ModalBody,
		ModalFooter,
	} from '@sveltestrap/sveltestrap';
	import Fa from 'svelte-fa';

	import { showToast } from '$lib/components/toast';

	export let shareLink = '';

	let isModalOpen = true;

	type SocialMediaData = {
		name: string;
		icon: IconDefinition;
		color: string;
		shareLink: string;
	};

	const SocialMedia = {
		TELEGRAM: 'telegram',
		WHATSAPP: 'whatsapp',
		FACEBOOK: 'facebook',
		X: 'x',
	} as const;
	type SocialMedia = (typeof SocialMedia)[keyof typeof SocialMedia];

	const socialMediaMappings: Record<SocialMedia, SocialMediaData> = {
		[SocialMedia.TELEGRAM]: {
			name: 'Telegram',
			icon: faTelegramPlane,
			color: '#3390EC',
			shareLink: `https://t.me/share/url?url=${shareLink}`,
		},
		[SocialMedia.WHATSAPP]: {
			name: 'WhatsApp',
			icon: faWhatsapp,
			color: '#25d366',
			shareLink: `https://wa.me/?text=${shareLink}`,
		},
		[SocialMedia.FACEBOOK]: {
			name: 'Facebook',
			icon: faFacebookF,
			color: '#1877f2',
			shareLink: `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`,
		},
		[SocialMedia.X]: {
			name: 'X',
			icon: faXTwitter,
			color: '#000',
			shareLink: `https://twitter.com/intent/tweet?url=${shareLink}`,
		},
	};

	function copyLink() {
		navigator.clipboard
			.writeText(shareLink)
			.then(() => {
				console.log('Link copied to clipboard!');
				isModalOpen = false;
				setTimeout(() => {
					showToast('Enlace copiado');
				}, 250);
			})
			.catch((error) => {
				console.error('Failed to copy: ', error);
			});
	}
</script>

<Modal
	centered
	fade
	isOpen={isModalOpen}
	toggle={() => (isModalOpen = !isModalOpen)}
	header="Compartir en"
>
	<ModalBody>
		<div class="social-media">
			{#each Object.entries(socialMediaMappings) as [socialMedia, data]}
				<a
					class="social-media-item {socialMedia}"
					href={data.shareLink}
					target="_blank"
				>
					<div class="icon-container">
						<Fa
							icon={data.icon}
							color={data.color}
						/>
					</div>
					<div>{data.name}</div>
				</a>
			{/each}
		</div>
	</ModalBody>

	<ModalFooter>
		<InputGroup>
			<Input
				readonly
				bind:value={shareLink}
			/>
			<Button
				color="primary"
				on:click={copyLink}>Copiar enlace</Button
			>
		</InputGroup>
	</ModalFooter>
</Modal>

<style lang="scss">
	:global(.modal-dialog) {
		--bs-modal-width: fit-content;
		--bs-modal-bg: white;

		.social-media {
			display: flex;
			justify-content: center;
			gap: min(5vw, 1.5rem);
			padding-inline: 0.75rem;
		}

		.social-media-item {
			text-decoration: none;
			color: inherit;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.25rem;
			font-size: min(4vw, 0.875rem);
		}

		.icon-container {
			display: inline-flex;
			width: min(16vw, 4rem);
			aspect-ratio: 1;
			border-radius: 100vmax;
			border: 2px solid var(--bs-gray-400);
			justify-content: center;
			align-items: center;
		}

		:global(.telegram svg),
		:global(.whatsapp svg) {
			font-size: min(8vw, 2rem);
		}

		:global(.facebook svg),
		:global(.x svg) {
			font-size: min(6vw, 1.5rem);
		}

		:global(.form-control) {
			--bs-body-bg: white;
			font-size: 14px;
		}
	}
</style>
