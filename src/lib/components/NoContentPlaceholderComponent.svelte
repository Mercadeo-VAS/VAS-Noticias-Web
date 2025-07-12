<script lang="ts">
	import { faInfo } from '@fortawesome/free-solid-svg-icons';
	import { Card } from '@sveltestrap/sveltestrap';
	import Fa from 'svelte-fa';

	export let message: string;
	export let cardTitle: string;
	export let cardDescription: string;
</script>

<div class="empty-state-container">
	<div class="empty-state-message">{message}</div>
	<Card class="text-center">
		<div class="card-header">
			<div class="icon-ring">
				<Fa
					icon={faInfo}
					size="xs"
				/>
			</div>
			<h6>{cardTitle}</h6>
		</div>
		<div class="card-body">
			{cardDescription}
		</div>
	</Card>
</div>

<style lang="scss">
	.empty-state-container {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		justify-content: center;
		align-items: center;
		padding: 6rem 2rem;
		text-align: center;

		.empty-state-message {
			font-size: 1.5rem;
			line-height: 1.4;
		}

		:global(.card) {
			background-color: var(--bs-white);
			max-width: 380px;
		}

		.card-header {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			padding: 1rem;
			border: none;
			background-color: var(--bs-white);
		}

		.card-body {
			padding-top: 0;
			text-align: left;
			line-height: 1.4;
			color: var(--bs-gray);
		}

		.icon-ring {
			display: inline-block;
			height: 1.25rem;
			aspect-ratio: 1;
			color: var(--bs-primary);
			border: 1.5px solid var(--bs-primary);
			border-radius: 100vmax;

			:global(svg) {
				margin-left: 1px;
				margin-bottom: 1px;
			}
		}

		h6 {
			margin: 0;
			color: var(--bs-primary);
			font-weight: normal;
		}
	}
</style>
