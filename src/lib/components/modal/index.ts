import SocialMediaModal from './SocialMediaModal.svelte';

type ModalProps = {
	titleText?: string;
	bodyText?: string;
	shareLink?: string;
};

function openSocialMediaModal(props: ModalProps) {
	new SocialMediaModal({
		target: document.body,
		props: { ...props },
	});
}

export { openSocialMediaModal, type ModalProps };
