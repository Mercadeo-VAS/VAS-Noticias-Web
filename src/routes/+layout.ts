import { AppURL } from '$lib/appTypes';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ route }) => {
	if (route.id === '/') {
		redirect(307, AppURL.EVENTOS);
	}

	return {};
};
