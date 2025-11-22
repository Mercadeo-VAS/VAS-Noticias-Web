<script lang="ts">
	import { page } from '$app/stores';
	import { AppURL } from '$lib/appTypes';
	import { faBullhorn, faCalendarAlt, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
	import { Nav, NavItem, NavLink } from '@sveltestrap/sveltestrap';
	import Fa from 'svelte-fa';
</script>

<div class="navbar">
	<Nav pills>
		<NavItem>
			<NavLink
				href="/eventos"
				active={$page.route.id === AppURL.UPCOMING_EVENTS}
			>
				<div class="wrapper">
					<div class="icon-container">
						<Fa
							icon={faCalendarDay}
							size="lg"
						/>
					</div>
					<h2>Próximos Eventos</h2>
				</div>
			</NavLink>
		</NavItem>

		<NavItem>
			<NavLink
				href="/anuncios"
				active={$page.route.id === AppURL.ANUNCIOS}
			>
				<div class="wrapper">
					<div class="icon-container">
						<Fa
							icon={faBullhorn}
							size="lg"
						/>
					</div>
					<h2>Anuncios</h2>
				</div>
			</NavLink>
		</NavItem>

		<NavItem>
			<NavLink
				href="/calendario"
				active={$page.route.id === AppURL.CALENDARIO}
			>
				<div class="wrapper">
					<div class="icon-container">
						<Fa
							icon={faCalendarAlt}
							size="lg"
						/>
					</div>
					<h2>Calendario</h2>
				</div>
			</NavLink>
		</NavItem>
	</Nav>
</div>

<style lang="scss">
	.navbar {
		padding: 0;

		:global(.nav-link) {
			--bs-nav-pills-link-active-bg: transparent;
			--bs-nav-link-color: var(--bs-gray);
			--bs-nav-pills-link-active-color: var(--bs-primary);
		}

		.wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 0.5em;
			border-bottom: 5px solid rgba(var(--app-color-secondary-rgb), 0);
			transition: border-color 300ms ease;
		}

		.active .wrapper {
			border-bottom: 5px solid rgba(var(--app-color-secondary-rgb), 1);
		}

		@media (width < 48rem) {
			position: fixed;
			bottom: 0;
			inset-inline: 0;
			background-color: white;
			border-top: 1px solid var(--bs-gray-200);

			:global(.nav) {
				display: flex;
				width: 100%;

				:global(.nav-item) {
					flex: 1;
				}
			}

			:global(.nav-link) {
				padding: 0.5rem 0 0.25rem;
				place-items: center;
			}

			.icon-container {
				padding: 0.5rem 1.5rem;
				position: relative;
				overflow: hidden;

				&::before {
					content: '';
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 0;
					height: 100%;
					background-color: rgba(
						var(--app-color-primary-rgb),
						var(--app-background-opacity)
					);
					border-radius: 100vmax;
					opacity: 0;
					z-index: -1;
					transition:
						width 200ms ease,
						height 200ms ease,
						opacity 200ms ease;
				}
			}

			.active .icon-container {
				border-radius: 100vmax;

				&::before {
					width: 100%;
					opacity: 1;
					background-color: rgba(
						var(--app-color-primary-rgb),
						var(--app-background-opacity)
					);
				}
			}

			h2 {
				margin-bottom: 6px;
				font-size: min(3.4vw, 16px);
				text-align: center;
			}
		}

		@media (width >= 48rem) {
			margin-top: 1rem;

			:global(.nav) {
				gap: 2rem;
			}

			:global(.nav-link) {
				padding-inline: 0;
			}

			:global(.nav-link:not(.active) h2) {
				font-weight: 400;
				letter-spacing: 0.002em;
				opacity: 0.9;
			}

			.icon-container {
				display: none;
			}

			h2 {
				margin: 0;
				font-size: 1.75rem;
				line-height: 1.5;
			}
		}
	}
</style>
