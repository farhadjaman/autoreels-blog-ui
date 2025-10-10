<script lang="ts">
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
	import { Label } from "@/components/ui/label"
	import { Input } from "@/components/ui/input"
	import { Button } from "@/components/ui/button"
	import { goto } from '$app/navigation';

	let { data } = $props();

	// Use $derived for reactive values from props
	const supabase = $derived(data.supabase);
	const session = $derived(data.session);

	let email = $state('');
	let password = $state('');
	let loading = $state(false);

	async function handleLogin(event: Event) {
		event.preventDefault();
		if (loading) return;
		loading = true;
		try {
			const { error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;

			// ensure cookies/session are current
			await supabase.auth.getSession();

			// go wherever you want after login
			goto('/'); // change to '/dashboard' etc. if needed
		} catch (e: any) {
			alert(e?.message ?? 'Login failed');
		} finally {
			loading = false;
		}
	}
</script>

<div class="w-full min-h-screen flex justify-center items-center ">
	<Card class="mx-auto w-full max-w-md">
		<CardHeader class="space-y-1">
			<CardTitle class="text-2xl font-bold">Login</CardTitle>
			<CardDescription>Enter your email and password to login to your account</CardDescription>
		</CardHeader>
		<CardContent>
			<!-- Wrap as a form so Enter submits; visually unchanged -->
			<form class="space-y-4" onsubmit={handleLogin}>
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" placeholder="m@example.com" required bind:value={email} />
				</div>
				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input id="password" type="password" required bind:value={password} />
				</div>
				<Button type="submit" class="w-full" disabled={loading}>
					Login
				</Button>
			</form>
		</CardContent>
	</Card>
</div>