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

<!-- <style lang="scss">
	/**
	 * We get the message `No scopable elements found in template.` if we try to style .toast here.
	 * Moving the styles to `src\styles\_custom-bootstrap.scss`
	 */
</style> -->
