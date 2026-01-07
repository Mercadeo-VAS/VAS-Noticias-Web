import type { CalendarEvent } from '$lib/appTypes';
import payloadApi from '$lib/payloadApi';
import colorService from '$lib/services/colorService';
import { AxiosError } from 'axios';
import type { PageServerLoad } from './$types';

type CalendarEventDTO = {
	id: string;
	ministry: {
		id: string;
		name: string;
	};
	title: string;
	dateStrings: string[];
};

export const load: PageServerLoad = async () => {
	let calendarEvents: CalendarEvent[] = [];

	const calendarEventsResponse = await payloadApi.get<CalendarEventDTO[]>('/calendar/active');
	if (calendarEventsResponse instanceof AxiosError) {
		console.error(`Response error: ${calendarEventsResponse.message}`);
	}

	const uniqueMinistries = Array.from(
		new Map(calendarEventsResponse.data.map((e) => [e.ministry.id, e.ministry])).values(),
	);

	const colorStep = 360 / (uniqueMinistries.length || 1);

	const hexColorByMinistryId: Record<string, string> = {};
	uniqueMinistries.forEach((ministry, index) => {
		const deg = (index + 1) * colorStep;
		hexColorByMinistryId[ministry.id] = colorService.getHexColorFromDeg(deg);
	});

	calendarEvents = calendarEventsResponse.data.map((event, index) => ({
		dateStrings: event.dateStrings,
		ministry: {
			name: event.ministry.name,
			hexColor: hexColorByMinistryId[event.ministry.id],
		},
		title: event.title,
	}));

	return {
		calendarEvents,
	};
};
