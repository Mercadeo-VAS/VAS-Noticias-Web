import type { Announcement, PayloadResponse } from '$lib/appTypes';
import payloadApi from '$lib/payloadApi';
import { AxiosError } from 'axios';
import type { PageServerLoad } from './$types';

type AnnouncementDTO = {
	id: string;
	title: string;
	slug: string;
	image: {
		url: string;
		thumbnailURL: string;
	};
	description: string;
	isActive: boolean;
	updatedAt: string;
	createdAt: string;
};

export const load: PageServerLoad = async () => {
	let announcementList: Announcement[] = [];

	const announcementsResponse = await payloadApi.get<PayloadResponse<AnnouncementDTO[]>>(
		'/announcements?where[isActive][equals]=true',
	);
	if (announcementsResponse instanceof AxiosError) {
		console.error(`Response error: ${announcementsResponse.message}`);
	}

	announcementList = announcementsResponse.data.docs.map((announcement, index) => ({
		index,
		slug: announcement.slug,
		imageLink: announcement.image.url,
		description: announcement.description,
	}));

	return {
		announcementList,
	};
};
