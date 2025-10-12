<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Mail } from '@lucide/svelte';
	import { supabase } from '$lib/supabase/supabaseClient';
	import { fetchPricingData } from '$lib/supabase/queries/pricing';
	import type {
		BillingType,
		FeatureValue,
		Feature,
		Plan
	} from '$lib/types/pricing';

	// =================================================================
	// TYPESCRIPT TYPES
	// =================================================================
	// Using imported types from $lib/types/pricing

	// =================================================================
	// SUPABASE DATA FETCHING
	// =================================================================
	// Using the imported fetchPricingData function from $lib/supabase/queries/pricing

	let billingType = $state<BillingType>('monthly');
	let currentUser = $state<{ id: string; email: string } | null>({
		id: 'user_123',
		email: 'test@example.com'
	});
	let subscription = $state<{ planId: string } | null>(null);

	// The Supabase fetch call is initiated here.
	let pricingPromise = fetchPricingData(supabase);

	// --- The rest of the helper functions and logic remain the same ---

	function getFeatureValue(plan: Plan, featureName: string) {
		const feature = plan.features.find((f) => f.name === featureName);
		if (!feature) return null;

		switch (feature.featureType) {
			case 'numeric':
				return feature.value.limit === null ? 'Unlimited' : feature.value.limit;
			case 'string':
				return feature.value.quality || feature.value.level || feature.value.duration;
			case 'boolean':
				return feature.value.enabled;
			default:
				return null;
		}
	}

	function isFeatureNewlyEnabled(
		currentPlan: Plan,
		previousPlan: Plan | null,
		feature: Feature
	): boolean {
		const currentValue = getFeatureValue(currentPlan, feature.name);
		if (!previousPlan)
			return currentValue === true || (typeof currentValue === 'number' && currentValue > 0);

		const previousValue = getFeatureValue(previousPlan, feature.name);
		if (feature.featureType === 'boolean') {
			return currentValue === true && previousValue === false;
		}
		if (feature.featureType === 'numeric') {
			const currentNum = currentValue === 'Unlimited' ? Infinity : (currentValue as number);
			const prevNum = previousValue === 'Unlimited' ? Infinity : (previousValue as number);
			return currentNum > prevNum;
		}
		return currentValue !== previousValue;
	}

	function handleSubscribe(plan: Plan) {
		if (!currentUser) {
			window.location.href = '/login';
			return;
		}
		
		// Redirect to main pricing page with plan parameter
		const planParam = encodeURIComponent(plan.name);
		const billingParam = encodeURIComponent(billingType);
		window.location.href = `https://autoreels.io/pricing?plan=${planParam}&billing=${billingParam}`;
	}
</script>

<div class="mx-auto w-full max-w-6xl py-6">
	<div class="container px-4 md:px-6">
		<div class="flex flex-col items-center space-y-4 text-center">
			<div class="space-y-2">
				<h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
					Select the <span class="text-primary">perfect plan for you</span>
				</h1>
				<p class="text-muted-foreground mx-auto max-w-[700px] md:text-xl">
					Select the perfect plan for your video creation needs
				</p>
			</div>

			<div class="mb-8 flex justify-center">
				<div class="bg-muted inline-flex items-center rounded-full p-1">
					<button
						onclick={() => (billingType = 'monthly')}
						class="rounded-full px-4 py-2 text-sm transition-all {billingType === 'monthly'
							? 'bg-background shadow-sm'
							: 'hover:bg-background/10'}"
					>
						Monthly
					</button>
					<button
						onclick={() => (billingType = 'yearly')}
						class="rounded-full px-4 py-2 text-sm transition-all {billingType === 'yearly'
							? 'bg-background shadow-sm'
							: 'hover:bg-background/10'}"
					>
						Yearly <Badge class="ml-2">Save 20%</Badge>
					</button>
					<button
						onclick={() => (billingType = 'lifetime')}
						class="rounded-full px-4 py-2 text-sm transition-all {billingType === 'lifetime'
							? 'bg-background shadow-sm'
							: 'hover:bg-background/10'}"
					>
						Lifetime
						<Badge variant="secondary" class="ml-2 animate-pulse bg-red-500 text-white">
							Limited Time
						</Badge>
					</button>
				</div>
			</div>

			{#await pricingPromise}
				<div class="py-10 text-center">Loading plans...</div>
			{:then { plans }}
				{@const paidPlans = plans.filter((p) => p.name !== 'free')}
				<div class="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
					{#each paidPlans as plan, index}
						{@const previousPlan = index > 0 ? paidPlans[index - 1] : null}
						<div
							class="bg-card rounded-2xl p-6 shadow-lg {plan.name === 'scale'
								? 'border-primary border-2'
								: ''}"
						>
							<h3 class="text-xl font-bold">{plan.displayName}</h3>
							<p class="text-muted-foreground mt-2">{plan.description}</p>

							<div class="mt-4">
								{#if plan.name === 'business'}
									<div class="text-2xl font-bold">Let's Talk</div>
								{:else}
									<div class="text-3xl font-bold">
										{#if billingType === 'lifetime'}
											${plan.lifetimePrice}
											<span class="text-muted-foreground text-lg font-normal">/lifetime</span>
										{:else if billingType === 'yearly'}
											${Math.floor(plan.yearlyPrice / 12)}
											<span class="text-muted-foreground text-lg font-normal">/mo</span>
										{:else}
											${plan.price}
											<span class="text-muted-foreground text-lg font-normal">/mo</span>
										{/if}
									</div>
								{/if}
							</div>

							{#if plan.name === 'business'}
								<Button class="mt-6 w-full" variant="outline">
									<Mail class="mr-2 h-4 w-4" /> Contact Sales
								</Button>
							{:else}
								<Button
									class="mt-6 w-full"
									variant={plan.name === 'scale' ? 'default' : 'outline'}
									onclick={() => handleSubscribe(plan)}
									disabled={subscription?.planId === plan.id}
								>
									{#if subscription?.planId === plan.id}
										Current Plan
									{:else if billingType === 'lifetime'}
										Get Lifetime Access
									{:else}
										Subscribe Now
									{/if}
								</Button>
							{/if}

							<Separator class="my-6" />

							<ul class="space-y-4">
								<li class="flex items-center">
									<span class="mr-2 text-green-500">✓</span>
									{getFeatureValue(plan, 'monthly_video_limit')} videos/month
								</li>
								<li class="flex items-center">
									<span class="mr-2 text-green-500">✓</span>
									{getFeatureValue(plan, 'video_length_limit') || 'Unlimited'} mins/video
								</li>
								<li class="flex items-center">
									<span class="mr-2 text-green-500">✓</span>
									{getFeatureValue(plan, 'max_team_members')} users/workspace
								</li>
								<li class="flex items-center">
									<span class="mr-2 text-green-500">✓</span>
									{getFeatureValue(plan, 'video_export_quality')} Export
								</li>
							</ul>

							<ul class="mt-6 space-y-4 text-left">
								{#if plan.name !== 'solo' && previousPlan}
									<li class="text-left">
										<span class="text-primary font-semibold"
											>Everything in {previousPlan.displayName} +</span
										>
									</li>
								{/if}
								{#each plan.features.filter((feature) => !['monthly_video_limit', 'video_length_limit', 'max_team_members', 'video_export_quality'].includes(feature.name) && isFeatureNewlyEnabled(plan, previousPlan, feature)) as feature}
									<li class="flex items-center">
										<span class="mr-2 text-green-500">✓</span>
										{feature.description}
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>

			{:catch error}
				<p class="text-red-500">Error loading plans: {error.message}</p>
			{/await}
		</div>
	</div>
</div>
