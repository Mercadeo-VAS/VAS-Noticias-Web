<script>
	import NavbarComponent from './NavbarComponent.svelte';
</script>

<header>
	<h1>
		<img
			class="logo"
			src="/images/Logo VAS.svg"
			alt="Logo Vida Abundante del Sur"
		/>
		<span class="primary">VAS</span>
		<span class="secondary">NOTICIAS</span>
	</h1>

	<NavbarComponent />
</header>

<style lang="scss">
	header {
		z-index: 1; // Make it appear over the announcements section
		padding-top: min(0.75rem, 2.5vw);
	}

	h1 {
		font-weight: bold;
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.25em;

		@media (width < 48rem) {
			font-size: 1.875rem;
		}

		@media (width >= 48rem) {
			font-size: 3rem;
		}

		.primary {
			color: var(--bs-primary);
		}

		.secondary {
			color: var(--bs-secondary);
		}
	}

	.logo {
		@media (width < 48rem) {
			height: 2.5rem;
		}

		@media (width >= 48rem) {
			height: 4rem;
		}
	}
</style>
