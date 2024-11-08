class AppService {
	stripHTMLTags(html: string) {
		return html
			.replace(/<\/?(div|p|i|span|strong|a|br)[^>]*>/gi, '') // Remove HTML tags
			.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
			.trim(); // Trim leading and trailing spaces
	}
}

export default new AppService();
