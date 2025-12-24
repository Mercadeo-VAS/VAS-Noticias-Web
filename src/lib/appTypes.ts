import type { Temporal } from 'temporal-polyfill';

export const AppURL = {
	UPCOMING_EVENTS: '/proximos-eventos',
	ANUNCIOS: '/anuncios',
	CALENDARIO: '/calendario',
} as const;

// Type for the Events in the Events Swiper
export type Event = {
	index: number;
	slug: string;
	imageLink: string;
	dateStrings: string[];
	calendarDates?: CalendarDate[];
	description: string;
	isFooterVisible?: boolean;
	isFlipped?: boolean;
	showFrontSide?: boolean;
};

// Type for the dates in the Dates Swiper
export type CalendarDate = {
	dateString: string;
	events: Event[];
	weekIndex: number;
};

export type Week = CalendarDate[];

// Type for the announcements in the Announcements Swiper
export type Announcement = {
	index: number;
	slug: string;
	imageLink: string;
	description: string;
	isSelected?: boolean;
};

export type CalendarEvent = {
	dateStrings: string[];
	ministry: string;
	title: string;
};

export type MonthCell = {
	date: Temporal.PlainDate | undefined;
	inMonth: boolean;
	events: CalendarEvent[];
};
