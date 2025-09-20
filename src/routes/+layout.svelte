<script lang="ts">
	export let data;

	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// The session is initially passed from your server load function in `+layout.server.ts`
	// We create a local reactive variable for it.
	let session = data.session;

	// This flag prevents rendering protected content before the client-side check is complete.
	let initialCheckCompleted = false;

	// This reactive statement is the core of the logic.
	// It automatically runs whenever `session` or the page URL changes.
	$: {
		// We only want to redirect after the component has mounted and performed its initial check.
		if (initialCheckCompleted) {
			const isLoginPage = $page.url.pathname === '/login';

			if (session && isLoginPage) {
				// If the user is logged in and visits the login page, send them to the homepage.
				goto('/', { replaceState: true });
			} else if (!session && !isLoginPage) {
				// If the user is logged out and not on the login page, send them to the login page.
				goto('/login', { replaceState: true });
			}
		}
	}

	// onMount runs only in the browser.
	onMount(() => {
		// Supabase auth listener handles real-time changes, like logging in/out in another tab.
		const { data: { subscription } } = data.supabase.auth.onAuthStateChange((_event, newSession) => {
			session = newSession;
		});

		// The initial server-side session check is done. Now, we can trust our client-side logic.
		initialCheckCompleted = true;

		// Cleanup the subscription when the component is destroyed.
		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<!--
  This conditional rendering block prevents content flashing.
  - If the user has a session, we show the page content.
  - If the user is on the login page, we show it so they can log in.
  - Otherwise, we show a loading message while we check the session and redirect.
-->
{#if session || $page.url.pathname === '/login'}
	<slot />
{:else}
	<div class="flex h-screen w-full items-center justify-center">
		<p class="text-gray-500">Loading...</p>
	</div>
{/if}
