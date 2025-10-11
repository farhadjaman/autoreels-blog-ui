<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Mail } from '@lucide/svelte';

	// Svelte 5 runes
	let billingType = $state<'monthly' | 'yearly' | 'lifetime'>('monthly');
	let isYearly = $derived(billingType === 'yearly');

	// Sample pricing data - you can replace this with actual data from your API
	const plans = [
		{
			id: 'solo',
			name: 'solo' as const,
			displayName: 'Solo',
			description: 'Perfect for individual creators',
			price: 29,
			yearlyPrice: 290,
			features: [
				{ name: 'monthly_video_limit', value: 50, description: '50 videos/month' },
				{ name: 'video_length_limit', value: 10, description: '10 mins/video' },
				{ name: 'max_team_members', value: 1, description: '1 user/workspace' },
				{ name: 'video_export_quality', value: 'HD', description: 'HD Export' },
				{ name: 'ai_templates', value: true, description: 'AI-powered templates' },
				{ name: 'brand_kit', value: true, description: 'Custom brand kit' }
			]
		},
		{
			id: 'scale',
			name: 'scale' as const,
			displayName: 'Scale',
			description: 'Ideal for growing teams',
			price: 79,
			yearlyPrice: 790,
			features: [
				{ name: 'monthly_video_limit', value: 200, description: '200 videos/month' },
				{ name: 'video_length_limit', value: 30, description: '30 mins/video' },
				{ name: 'max_team_members', value: 5, description: '5 users/workspace' },
				{ name: 'video_export_quality', value: '4K', description: '4K Export' },
				{ name: 'ai_templates', value: true, description: 'AI-powered templates' },
				{ name: 'brand_kit', value: true, description: 'Custom brand kit' },
				{ name: 'team_collaboration', value: true, description: 'Team collaboration' },
				{ name: 'priority_support', value: true, description: 'Priority support' }
			]
		},
		{
			id: 'business',
			name: 'business' as const,
			displayName: 'Business',
			description: 'Enterprise solutions',
			price: 0,
			yearlyPrice: 0,
			features: [
				{ name: 'monthly_video_limit', value: 'Unlimited', description: 'Unlimited videos/month' },
				{ name: 'video_length_limit', value: 'Unlimited', description: 'Unlimited mins/video' },
				{ name: 'max_team_members', value: 'Unlimited', description: 'Unlimited users/workspace' },
				{ name: 'video_export_quality', value: '4K+', description: '4K+ Export' },
				{ name: 'ai_templates', value: true, description: 'AI-powered templates' },
				{ name: 'brand_kit', value: true, description: 'Custom brand kit' },
				{ name: 'team_collaboration', value: true, description: 'Team collaboration' },
				{ name: 'priority_support', value: true, description: 'Priority support' },
				{ name: 'custom_integrations', value: true, description: 'Custom integrations' },
				{ name: 'dedicated_account_manager', value: true, description: 'Dedicated account manager' }
			]
		}
	];

	function handleSubscribe(plan: any) {
		// Redirect to app pricing page
		window.open('https://app.autoreels.io/pricing', '_blank');
	}

	function getFeatureValue(plan: any, featureName: string) {
		const feature = plan.features.find((f: any) => f.name === featureName);
		return feature ? feature.value : null;
	}

	function isFeatureNewlyEnabled(currentPlan: any, previousPlan: any, feature: any) {
		if (!previousPlan) return getFeatureValue(currentPlan, feature.name);
		const currentValue = getFeatureValue(currentPlan, feature.name);
		const previousValue = getFeatureValue(previousPlan, feature.name);
		
		if (typeof currentValue === 'boolean') {
			return currentValue && !previousValue;
		}
		if (typeof currentValue === 'number') {
			return currentValue > previousValue;
		}
		return currentValue !== previousValue;
	}
</script>

<div class="w-full max-w-6xl mx-auto py-6">
	<div class="container px-4 md:px-6">
		<div class="flex flex-col items-center space-y-4 text-center">
			<div class="space-y-2">
				<h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
					Select the <span class="text-primary">perfect plan for you</span>
				</h1>
				<p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
					Select the perfect plan for your video creation needs
				</p>
			</div>

			<!-- Billing Type Selector -->
			<div class="flex justify-center mb-8">
				<div class="inline-flex items-center bg-muted rounded-full p-1">
					<button
						onclick={() => billingType = 'monthly'}
						class="px-4 py-2 rounded-full text-sm transition-all {billingType === 'monthly' ? 'bg-background shadow-sm' : 'hover:bg-background/10'}"
					>
						Monthly
					</button>
					<button
						onclick={() => billingType = 'yearly'}
						class="px-4 py-2 rounded-full text-sm transition-all {billingType === 'yearly' ? 'bg-background shadow-sm' : 'hover:bg-background/10'}"
					>
						Yearly <Badge class="ml-2">Save 20%</Badge>
					</button>
					<button
						onclick={() => billingType = 'lifetime'}
						class="px-4 py-2 rounded-full text-sm transition-all {billingType === 'lifetime' ? 'bg-background shadow-sm' : 'hover:bg-background/10'}"
					>
						Lifetime{' '}
						<Badge variant="secondary" class="ml-2 bg-red-500 text-white animate-pulse">
							Limited Time
						</Badge>
					</button>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-3 w-full">
				{#each plans as plan, index}
					{@const previousPlan = index > 0 ? plans[index - 1] : null}
					<div
						class="rounded-2xl p-6 bg-card shadow-lg {plan.name === 'scale' ? 'border-2 border-primary' : ''}"
					>
						<h3 class="text-xl font-bold">{plan.displayName}</h3>
						<p class="text-muted-foreground mt-2">{plan.description}</p>
						
						<!-- Price Display -->
						<div class="mt-4">
							{#if plan.name === 'business'}
								<div class="text-2xl font-bold">Let's Talk</div>
							:else if plan.name === 'solo'}
								<div class="text-3xl font-bold">
									{#if billingType === 'lifetime'}
										$499
										<span class="text-lg font-normal text-muted-foreground">/lifetime</span>
									:else if billingType === 'yearly'}
										${Math.floor(plan.yearlyPrice / 12)}
										<span class="text-lg font-normal text-muted-foreground">/mo</span>
									:else}
										${plan.price}
										<span class="text-lg font-normal text-muted-foreground">/mo</span>
									{/if}
								</div>
							:else if plan.name === 'scale'}
								<div class="text-3xl font-bold">
									{#if billingType === 'lifetime'}
										$899
										<span class="text-lg font-normal text-muted-foreground">/lifetime</span>
									:else if billingType === 'yearly'}
										${Math.floor(plan.yearlyPrice / 12)}
										<span class="text-lg font-normal text-muted-foreground">/mo</span>
									:else}
										${plan.price}
										<span class="text-lg font-normal text-muted-foreground">/mo</span>
									{/if}
								</div>
							{/if}
						</div>

						<!-- Action Button -->
						{#if plan.name === 'business'}
							<Button
								class="w-full mt-6"
								variant="outline"
							>
								<Mail class="w-4 h-4 mr-2" /> Contact Sales
							</Button>
						:else if plan.name === 'solo'}
							<Button
								class="w-full mt-6"
								variant="outline"
								onclick={() => handleSubscribe(plan)}
							>
								{billingType === 'lifetime' ? 'Get Lifetime Access' : 'Subscribe Now'}
							</Button>
						:else if plan.name === 'scale'}
							<Button
								class="w-full mt-6"
								variant="default"
								onclick={() => handleSubscribe(plan)}
							>
								{billingType === 'lifetime' ? 'Get Lifetime Access' : 'Subscribe Now'}
							</Button>
						{/if}

						<Separator class="my-6" />

						<!-- Features List -->
						<ul class="space-y-4">
							<li class="flex items-center">
								<span class="text-green-500 mr-2">✓</span>
								{getFeatureValue(plan, 'monthly_video_limit')} videos/month
							</li>
							<li class="flex items-center">
								<span class="text-green-500 mr-2">✓</span>
								{getFeatureValue(plan, 'video_length_limit') || 'Unlimited'} mins/video
							</li>
							<li class="flex items-center">
								<span class="text-green-500 mr-2">✓</span>
								{getFeatureValue(plan, 'max_team_members')} users/workspace
							</li>
							<li class="flex items-center">
								<span class="text-green-500 mr-2">✓</span>
								{getFeatureValue(plan, 'video_export_quality')} Export
							</li>
						</ul>

						<!-- Additional Features -->
						<ul class="space-y-4 text-left mt-6">
							{#if plan.name !== 'solo'}
								<li class="text-left">
									<span class="font-semibold text-primary">
										{previousPlan?.displayName} +
									</span>
								</li>
							{/if}
							{#each plan.features.filter(feature => 
								!['monthly_video_limit', 'video_length_limit', 'max_team_members', 'video_export_quality', 'support_level'].includes(feature.name) && 
								isFeatureNewlyEnabled(plan, previousPlan, feature)
							) as feature}
								<li class="flex items-center">
									<span class="text-green-500 mr-2">✓</span>
									{feature.description}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
