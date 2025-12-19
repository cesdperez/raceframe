import posthog from 'posthog-js';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

export const prerender = true;

export const load = async () => {
	if (browser) {
		posthog.init(env.PUBLIC_POSTHOG_KEY || 'dummy_key', {
			api_host: 'https://eu.i.posthog.com',
			defaults: '2025-11-30',

			// Privacy-focused: use session storage instead of cookies
			persistence: 'sessionStorage',
			person_profiles: 'identified_only',

			// SPA optimization
			capture_pageview: 'history_change',
			autocapture: true,

			// Disable unused features
			disable_session_recording: true,
			disable_surveys: true,
			advanced_disable_feature_flags: true
		});
	}
};
