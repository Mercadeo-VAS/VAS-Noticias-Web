import appService from '$lib/appService';
import type { Event, PayloadResponse } from '$lib/appTypes';
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

export const load: PageServerLoad = async () => {
	let rawEvents: Event[] = [];

	const upcomingEventsResponse = await payloadApi.get<PayloadResponse<UpcomingEventDTO[]>>(
		'/upcoming-events?where[isActive][equals]=true',
	);
	if (upcomingEventsResponse instanceof AxiosError) {
		console.error(`Response error: ${upcomingEventsResponse.message}`);
	}

	rawEvents = upcomingEventsResponse.data.docs.map((event, index) => ({
		index,
		slug: event.slug,
		imageLink: event.image.url,
		dateStrings: event.dateStrings,
		description: event.description,
	}));

	const { eventList, weekList } = appService.generateAppData(rawEvents);

	return {
		eventList,
		weekList,
	};
};
