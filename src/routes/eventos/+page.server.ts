import appService from '$lib/appService';
import type { Event } from '$lib/appTypes';
import payloadApi from '$lib/payloadApi';
import { AxiosError } from 'axios';
import type { PageServerLoad } from './$types';

type UpcomingEventDTO = {
	id: string;
	title: string;
	slug: string;
	image: {
		url: string;
		thumbnailURL: string;
	};
	description: string;
	isActive: boolean;
	dateStrings: string[];
	updatedAt: string;
	createdAt: string;
};

export const load: PageServerLoad = async ({ url }) => {
	const eventSlug = url.searchParams.get('evento');
	const appDomain = url.origin;

	let rawEvents: Event[] = [];

	const upcomingEventsResponse =
		await payloadApi.get<UpcomingEventDTO[]>('/upcoming-events/active');
	if (upcomingEventsResponse instanceof AxiosError) {
		console.error(`Response error: ${upcomingEventsResponse.message}`);
	}

	rawEvents = upcomingEventsResponse.data.map((event, index) => ({
		index,
		slug: event.slug,
		imageLink: event.image.url,
		dateStrings: event.dateStrings,
		description: event.description,
	}));

	if (!rawEvents.length) {
		return {
			eventList: [],
			weekList: [],
		};
	}

	const { eventList, weekList } = appService.generateAppData(rawEvents);

	return {
		eventSlug,
		appDomain,
		eventList,
		weekList,
	};
};
