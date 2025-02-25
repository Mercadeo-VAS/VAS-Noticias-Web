<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let isSelected;
	export let toggle: () => void;

	const transitionDurationInMs = 750;

	let mounted = false;
	let element: HTMLElement;
	let startWidth = 0;
	let startHeight = 0;
	let startStyle = '';
	let transitionStyle = '';

	function disablesBodyScrolling() {
		if (window.innerWidth === document.documentElement.clientWidth) {
			// There is no scrollbar
			return;
		}

		// Disable scrolling
		document.body.style.overflow = 'hidden';

		// Prevent layout shift
		const scrollDiv = document.createElement('div');
		scrollDiv.style.width = '500px';
		scrollDiv.style.overflow = 'scroll';
		document.body.appendChild(scrollDiv);
		const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
		document.body.removeChild(scrollDiv);
		document.body.style.paddingRight = `${scrollbarWidth}px`;
	}

	function restoreBodyScrolling() {
		document.body.style.overflow = ''; // Restore scrolling
		document.body.style.paddingRight = ''; // Reset padding
	}

	function getStartTransitionStyle(): string {
		if (startStyle) {
			return startStyle;
		}

		const { width, height, top, left } = element.getBoundingClientRect();
		startWidth = width;
		startHeight = height;

		startStyle = `
			--overlay-position: fixed;
			--overlay-width: ${width}px;
			--overlay-height: ${height}px;
			--dialog-height: ${height}px;
			--overlay-start-width: ${startWidth}px;
			--overlay-start-height: ${startHeight}px;
			--overlay-top: ${top}px;
			--overlay-left: ${left}px;
			--modal-margin: 0;
			--transition-duration: ${transitionDurationInMs}ms;
		`;

		return startStyle;
	}

	function getEndTransitionStyle(): string {
		return `
			--overlay-position: fixed;
			--overlay-width: 100%;
			--overlay-height: 100%;
			--dialog-height: calc(100dvh - var(--modal-margin) * 2);
			--overlay-start-width: ${startWidth}px;
			--overlay-start-height: ${startHeight}px;
			--overlay-top: 0;
			--overlay-left: 0;
			--modal-margin: 2rem;
			--transition-duration: ${transitionDurationInMs}ms;
		`;
	}

	function viewDetails() {
		// While we use `pointer-events: none` on the overlay, there is no need to disable scrolling.
		//disablesBodyScrolling();

		transitionStyle = getStartTransitionStyle();
		setTimeout(() => {
			transitionStyle = getEndTransitionStyle();
		}, 0);
	}

	function closeDetails() {
		transitionStyle = getStartTransitionStyle();
		setTimeout(() => {
			transitionStyle = '';
			startStyle = '';
			restoreBodyScrolling();
		}, transitionDurationInMs);
	}

	onMount(() => {
		mounted = true;
	});

	$: if (mounted && isSelected !== undefined) {
		if (isSelected) {
			viewDetails();
		} else {
			closeDetails();
		}
	}
</script>

{#if isSelected}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div
		class="backdrop"
		on:click={toggle}
		transition:fade={{ duration: transitionDurationInMs }}
	/>
{/if}

<div
	class="animate-to-center-placeholder"
	style={transitionStyle}
>
	<div
		class="animate-to-center-overlay"
		bind:this={element}
	>
		<div class="animate-to-center-dialog">
			<div class="animate-to-center-content">
				<slot />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
		z-index: 1000;
	}

	.animate-to-center-placeholder {
		height: var(--overlay-start-height);
	}

	.animate-to-center-overlay {
		position: var(--overlay-position);
		width: var(--overlay-width);
		height: var(--overlay-height);
		top: var(--overlay-top);
		left: var(--overlay-left);
		transition: all var(--transition-duration) ease;
		overflow-x: hidden;
		overflow-y: auto;
		z-index: 1001;
		pointer-events: none;
	}

	.animate-to-center-dialog {
		margin-block: var(--modal-margin);
		margin-inline: auto;
		transition: all var(--transition-duration) ease;
		display: flex;
		justify-content: center;
	}

	.animate-to-center-content {
		width: var(--overlay-start-width);
		pointer-events: auto;
	}
</style>
