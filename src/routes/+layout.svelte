<script lang="ts">
	let { data, children } = $props()

	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let session = $state(data.session);
	let isInitialized = $state(false);

	// Handle redirects based on session state and current page
	$effect(() => {
		if (!isInitialized) return;
		
		const isLoginPage = $page.url.pathname === '/login';

		if (session && isLoginPage) {
			// If the user is logged in and visits the login page, send them to the homepage.
			goto('/', { replaceState: true });
		} else if (!session && !isLoginPage) {
			// If the user is logged out and not on the login page, send them to the login page.
			goto('/login', { replaceState: true });
		}
	});

	// onMount runs only in the browser.
	onMount(() => {
		// Supabase auth listener handles real-time changes, like logging in/out in another tab.
		const { data: { subscription } } = data.supabase.auth.onAuthStateChange((_event, newSession) => {
			session = newSession;
		});

		// Mark as initialized so redirect logic can run
		isInitialized = true;

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
{#if !isInitialized}
	<div class="flex h-screen w-full items-center justify-center">
		<p class="text-gray-500">Loading...</p>
	</div>
{:else if session || $page.url.pathname === '/login'}
	{@render children()}
{:else}
	<div class="flex h-screen w-full items-center justify-center">
		<p class="text-gray-500">Redirecting...</p>
	</div>
{/if}
