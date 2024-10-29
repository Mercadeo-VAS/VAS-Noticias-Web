<script lang="ts">
	import { Toast, ToastBody } from '@sveltestrap/sveltestrap';
	import { onMount } from 'svelte';

	export let message: string;

	let isOpen = false;

	onMount(() => {
		isOpen = true;
	});
</script>

<Toast
	{isOpen}
	autohide
	delay={3000}
	theme="dark"
>
	<ToastBody>{message}</ToastBody>
</Toast>

<style lang="scss">
	:global(:root .toast) {
		--bs-toast-padding-x: 1rem;
		--bs-toast-bg: var(--bs-dark);
		--bs-toast-color: white;
		--bs-toast-max-width: 240px;

		position: fixed;
		top: 1rem;
		right: 1rem;
	}
</style>
