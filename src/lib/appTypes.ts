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
