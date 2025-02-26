<script>
	import NavbarComponent from '$lib/components/NavbarComponent.svelte';
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
	}

	h1 {
		font-weight: bold;
		font-size: min(3rem, 8vw);
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.25em;

		.primary {
			color: var(--bs-primary);
		}

		.secondary {
			color: var(--bs-secondary);
		}
	}

	.logo {
		height: min(4rem, 11vw);
	}
</style>
