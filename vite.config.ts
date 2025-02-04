import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				quietDeps: true, // Silence deprecation warnings from dependencies
				silenceDeprecations: ['import'], // Migration to `@use` is unnecessary since `@import` is only used in the root `src/styles/main.scss` file and the requested files will be imported only once.
				api: 'modern', // Use the modern API instead of the legacy JavaScript API
			},
		},
	},
});
