
import type { LayoutLoad } from './$types';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createBrowserClient, isBrowser } from '@supabase/ssr';
import { parse } from 'cookie'; // npm i cookie

// Optional: uncomment if you want to avoid any SSR for this layout
export const ssr = false;

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: { fetch },
		cookies: {
			getAll() {
				if (!isBrowser()) return [];
				const jar = parse(document.cookie ?? '');
				return Object.entries(jar).map(([name, value]) => ({ name, value }));
			},
			setAll(cookies) {
				if (!isBrowser()) return;
				for (const { name, value, options } of cookies) {
					let str = `${name}=${value ?? ''}; Path=${options?.path ?? '/'}`;
					if (options?.expires) str += `; Expires=${new Date(options.expires).toUTCString()}`;
					if (options?.maxAge) str += `; Max-Age=${options.maxAge}`;
					if (options?.domain) str += `; Domain=${options.domain}`;
					if (options?.sameSite) str += `; SameSite=${options.sameSite}`;
					if (options?.secure ?? true) str += `; Secure`;
					document.cookie = str;
				}
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session };
};