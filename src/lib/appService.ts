import { Temporal } from 'temporal-polyfill';
import type { CalendarDate, Event, Week } from './appTypes';

class AppService {
	private _findEarliestAndLatestDates(events: Event[]): {
		earliestDate: Temporal.PlainDate;
		latestDate: Temporal.PlainDate;
	} {
		let earliestDate: Temporal.PlainDate | null = null;
		let latestDate: Temporal.PlainDate | null = null;

		events.forEach((event) => {
			event.dateStrings.forEach((dateString) => {
				const date = Temporal.PlainDate.from(dateString);
				if (!earliestDate || Temporal.PlainDate.compare(date, earliestDate) < 0) {
					earliestDate = date;
				}
				if (!latestDate || Temporal.PlainDate.compare(date, latestDate) > 0) {
					latestDate = date;
				}
			});
		});

		if (!earliestDate || !latestDate) {
			throw new Error('No dates found in events');
		}

		return { earliestDate, latestDate };
	}

	// Get previous Monday (or same Monday)
	private _getMondayBefore(date: Temporal.PlainDate): Temporal.PlainDate {
		const dayOfWeek = date.dayOfWeek;
		const daysToSubtract = dayOfWeek === 1 ? 0 : dayOfWeek - 1;

		return date.subtract({ days: daysToSubtract });
	}

	// Get next Sunday (or same Sunday)
	private _getSundayAfter(date: Temporal.PlainDate): Temporal.PlainDate {
		const dayOfWeek = date.dayOfWeek;
		const daysToAdd = dayOfWeek === 7 ? 0 : 7 - dayOfWeek;

		return date.add({ days: daysToAdd });
	}

	generateAppData(rawEvents: Event[]): {
		eventList: Event[];
		weekList: Week[];
	} {
		// Initialize events with empty calendarDates array
		const eventList: Event[] = rawEvents.map((event) => ({
			...event,
			calendarDates: [],
		}));

		const { earliestDate, latestDate } = this._findEarliestAndLatestDates(eventList);
		const startDate = this._getMondayBefore(earliestDate);
		const endDate = this._getSundayAfter(latestDate);

		const weekList: Week[] = [];
		let currentDate = startDate;
		let weekIndex = 0;

		// Generate weeks until we reach or pass the end date
		while (Temporal.PlainDate.compare(currentDate, endDate) <= 0) {
			const week: Week = [];

			// Generate 7 days for the current week
			for (let i = 0; i < 7; i++) {
				const calendarDate: CalendarDate = {
					dateString: currentDate.toString(),
					events: [],
					weekIndex,
				};

				// Find events for this date and create bidirectional relationship
				eventList.forEach((event) => {
					const currentDateString = currentDate.toString();
					if (event.dateStrings.includes(currentDateString)) {
						// Add event to calendar date
						calendarDate.events.push(event);
						// Add calendar date to event
						event.calendarDates!.push(calendarDate);
					}
				});

				week.push(calendarDate);
				currentDate = currentDate.add({ days: 1 });
			}

			weekList.push(week);
			weekIndex++;
		}

		return { eventList, weekList };
	}

	stripHTMLTags(html: string) {
		return html
			.replace(/<\/?(div|p|i|span|strong|a|br)[^>]*>/gi, '') // Remove HTML tags
			.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
			.trim(); // Trim leading and trailing spaces
	}
}

export default new AppService();
