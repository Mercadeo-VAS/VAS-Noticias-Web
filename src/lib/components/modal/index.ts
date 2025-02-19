import SocialMediaModal from './SocialMediaModal.svelte';

function openSocialMediaModal(shareLink: string) {
	new SocialMediaModal({
		target: document.body,
		props: { shareLink },
	});
}

export { openSocialMediaModal };
