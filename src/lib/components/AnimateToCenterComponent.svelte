<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let isSelected;
	export let toggle: () => void;

	const transitionDurationInMs = 750;

	let mounted = false;
	let element: HTMLElement;
	let startWidth = 0;
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

		const { width, top, left } = element.getBoundingClientRect();
		startWidth = width;

		startStyle = `
			position: fixed;
			width: ${width}px;
			top: ${top}px;
			left: ${left}px;
			z-index: 1001;
			transition: all ${transitionDurationInMs}ms ease;
		`;

		return startStyle;
	}

	function getEndTransitionStyle(): string {
		return `
			position: fixed;
			width: min(${startWidth}px, 90%);
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 1001;
			transition: all ${transitionDurationInMs}ms ease;
		`;
	}

	function viewDetails() {
		disablesBodyScrolling();
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
		class="overlay"
		on:click={toggle}
		transition:fade={{ duration: transitionDurationInMs }}
	/>
{/if}

<div
	class="animate-to-center-wrapper"
	class:transitioned={transitionStyle}
>
	<div
		bind:this={element}
		style={transitionStyle}
	>
		<slot />
	</div>
</div>

<style lang="scss">
	.transitioned {
		padding-bottom: calc(100% + 40px);
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
		z-index: 1000;
	}
</style>
