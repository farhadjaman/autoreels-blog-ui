<script lang="ts">
	import { goto } from '$app/navigation';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	// Management options with their details
	const managementOptions = $state([
		{
			id: 'blogs',
			title: 'Blog Management',
			description: 'Create, edit, and manage blog posts with multi-language support',
			route: '/blogs',
			icon: '📝',
			color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
			textColor: 'text-blue-700'
		},
		{
			id: 'coupons',
			title: 'Coupon Management',
			description: 'Manage discount coupons, track usage, and monitor performance',
			route: '/coupons',
			icon: '🎫',
			color: 'bg-green-50 border-green-200 hover:bg-green-100',
			textColor: 'text-green-700'
		}
	]);

	function navigateToRoute(route: string) {
		goto(route);
	}

	function handleCardClick(route: string) {
		navigateToRoute(route);
	}

	function handleKeydown(event: KeyboardEvent, route: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			navigateToRoute(route);
		}
	}
</script>

<svelte:head>
	<title>Dashboard - AutoReels Management</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="container mx-auto px-4 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-gray-900 mb-2">Management Dashboard</h1>
			<p class="text-lg text-gray-600">Welcome to your AutoReels management center</p>
		</div>

		<!-- Management Cards Grid -->
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each managementOptions as option}
				<Card 
					class="cursor-pointer transition-transform duration-300 hover:scale-[0.98] {option.color}"
					onclick={() => handleCardClick(option.route)}
					onkeydown={(e) => handleKeydown(e, option.route)}
					role="button"
					tabindex={0}
					aria-label={`Navigate to ${option.title}`}
				>
					<CardHeader class="pb-4">
						<div class="flex items-center gap-3 mb-2">
							<span class="text-3xl">{option.icon}</span>
							<CardTitle class="text-xl {option.textColor}">{option.title}</CardTitle>
						</div>
						<CardDescription class="text-gray-600">
							{option.description}
						</CardDescription>
					</CardHeader>
					
					<CardContent class="pt-0">
						<!-- Action Button -->
						<Button 
							class="w-full {option.textColor} border-current"
							variant="outline"
							onclick={(e) => {
								e.stopPropagation();
								handleCardClick(option.route);
							}}
						>
							Manage {option.title.split(' ')[0]}
						</Button>
					</CardContent>
				</Card>
			{/each}
		</div>

	</div>
</div>