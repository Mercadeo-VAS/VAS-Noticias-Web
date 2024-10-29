import Toast from './Toast.svelte';

function showToast(message: string) {
	new Toast({
		target: document.body,
		props: { message },
	});
}

export { showToast };
