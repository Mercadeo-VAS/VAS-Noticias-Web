import type { CalendarEvent } from '$lib/appTypes';
import payloadApi from '$lib/payloadApi';
import { AxiosError } from 'axios';
import type { PageServerLoad } from './$types';

type CalendarEventDTO = {
	id: string;
	ministry: {
		id: string;
		name: string;
	};
	title: string;
	description?: string;
	dateString: string;
};

export const load: PageServerLoad = async () => {
	let calendarEvents: CalendarEvent[] = [];

	const calendarEventsResponse = await payloadApi.get<CalendarEventDTO[]>('/calendar/active');
	if (calendarEventsResponse instanceof AxiosError) {
		console.error(`Response error: ${calendarEventsResponse.message}`);
	}

	calendarEvents = calendarEventsResponse.data.map((event) => ({
		dateString: event.dateString,
		ministry: event.ministry.name,
		title: event.title,
		description: event.description,
	}));

	return {
		calendarEvents,
	};
};
