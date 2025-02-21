<script lang="ts">
	import { page } from '$app/stores';
	import { AppURL } from '$lib/appTypes';
	import { Nav, NavItem, NavLink } from '@sveltestrap/sveltestrap';
</script>

<div class="navbar">
	<Nav pills>
		<NavItem>
			<NavLink
				href="/eventos"
				active={$page.route.id === AppURL.EVENTOS}
			>
				<h2>Próximos Eventos</h2>
			</NavLink>
		</NavItem>
		<NavItem>
			<NavLink
				href="anuncios"
				active={$page.route.id === AppURL.ANUNCIOS}
			>
				<h2>Anuncios</h2>
			</NavLink>
		</NavItem>
	</Nav>
</div>

<style lang="scss">
	.navbar {
		:global(.nav) {
			gap: 2rem;
		}

		:global(.nav-item:has(.active)) {
			border-bottom: 5px solid var(--bs-secondary);
		}

		:global(.nav-link) {
			padding-inline: 0;
		}

		:global(.nav-link.active) {
			--bs-nav-pills-link-active-bg: transparent;
			--bs-nav-pills-link-active-color: var(--bs-primary);
		}

		:global(.nav-link:not(.active) h2) {
			font-weight: 400;
			letter-spacing: 0.002em;
			opacity: 0.9;
		}

		h2 {
			margin: 0;
		}
	}
</style>
