import axios, { AxiosError } from 'axios';

import { PUBLIC_PAYLOAD_BASE_URL } from '$env/static/public';

// Axios instance with default headers
const payloadApi = axios.create({
	baseURL: PUBLIC_PAYLOAD_BASE_URL,
});

// Response interceptor
payloadApi.interceptors.response.use(
	(response) => response,
	// By doing this, we can check if the responses return an AxiosError and handle it.
	(error: AxiosError) => error,
);

export default payloadApi;
