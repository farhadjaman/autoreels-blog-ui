<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';

	let isLoaded = false;

	onMount(() => {
		isLoaded = true;
	});

	function handleAppClick() {
		window.open('https://app.autoreels.io', '_blank');
	}

	function handleDemoClick() {
		// Scroll to demo section or open demo video
		const demoSection = document.getElementById('demo-section');
		if (demoSection) {
			demoSection.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>AutoReels: Features </title>
	<meta name="description" content="Go viral with AI-powered animated subtitles. Elevate your videos with professional-grade animated captions, no design skills needed." />
</svelte:head>


<!-- Features Section -->
<section class="py-20 bg-muted/30">
	<div class="container mx-auto px-4">
		<div class="max-w-6xl mx-auto">
			<!-- Section Header -->
			<div class="text-center mb-16">
				<h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
					Built for Every Creator
				</h2>
				<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
					Discover how AutoReels empowers different types of creators with industry-specific solutions
				</p>
			</div>

			<!-- Use Cases Grid -->
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
				<!-- Content Creators -->
				<div class="group p-6 bg-background rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
					<div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
						<span class="text-2xl">🎬</span>
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2">Content Creators</h3>
					<p class="text-muted-foreground mb-4">Transform your long-form content into viral short-form videos that capture attention across all platforms.</p>
					<ul class="text-sm text-muted-foreground space-y-1">
						<li>• AI-powered highlight detection</li>
						<li>• 50+ animated subtitle styles</li>
						<li>• One-click social publishing</li>
						<li>• Performance analytics</li>
					</ul>
				</div>

				<!-- Digital Marketers -->
				<div class="group p-6 bg-background rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
					<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
						<span class="text-2xl">📊</span>
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2">Digital Marketers</h3>
					<p class="text-muted-foreground mb-4">Create engaging video content that drives conversions and builds brand awareness at scale.</p>
					<ul class="text-sm text-muted-foreground space-y-1">
						<li>• Brand-consistent templates</li>
						<li>• A/B testing capabilities</li>
						<li>• ROI tracking & attribution</li>
						<li>• Multi-language localization</li>
					</ul>
				</div>

				<!-- Educators -->
				<div class="group p-6 bg-background rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
					<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
						<span class="text-2xl">🎓</span>
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2">Educators & Trainers</h3>
					<p class="text-muted-foreground mb-4">Turn educational content into digestible, shareable videos that improve learning outcomes.</p>
					<ul class="text-sm text-muted-foreground space-y-1">
						<li>• Course content repurposing</li>
						<li>• Interactive video elements</li>
						<li>• Accessibility-first subtitles</li>
						<li>• Student engagement analytics</li>
					</ul>
				</div>

				<!-- Small Businesses -->
				<div class="group p-6 bg-background rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
					<div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
						<span class="text-2xl">🏢</span>
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2">Small Businesses</h3>
					<p class="text-muted-foreground mb-4">Professional video marketing without the professional budget or complex software.</p>
					<ul class="text-sm text-muted-foreground space-y-1">
						<li>• Product showcase templates</li>
						<li>• Customer testimonial optimization</li>
						<li>• Local market targeting</li>
						<li>• Social commerce integration</li>
					</ul>
				</div>

				<!-- Creative Agencies -->
				<div class="group p-6 bg-background rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
					<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
						<span class="text-2xl">🚀</span>
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2">Creative Agencies</h3>
					<p class="text-muted-foreground mb-4">Scale video production for multiple clients with consistent quality and faster turnaround.</p>
					<ul class="text-sm text-muted-foreground space-y-1">
						<li>• Team collaboration tools</li>
						<li>• Client brand management</li>
						<li>• Bulk processing capabilities</li>
						<li>• White-label options</li>
					</ul>
				</div>

				<!-- Podcasters -->
				<div class="group p-6 bg-background rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
					<div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
						<span class="text-2xl">🎙️</span>
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2">Podcasters</h3>
					<p class="text-muted-foreground mb-4">Transform podcast episodes into visual content that extends your reach beyond audio platforms.</p>
					<ul class="text-sm text-muted-foreground space-y-1">
						<li>• Audio waveform visualizations</li>
						<li>• Quote card generation</li>
						<li>• Episode highlight reels</li>
						<li>• Cross-platform distribution</li>
					</ul>
				</div>
			</div>

			<!-- Key Features -->
			<div class="text-center mb-12">
				<h3 class="text-2xl md:text-3xl font-bold text-foreground mb-4">
					Powerful Features for Every Creator
				</h3>
				<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
					Everything you need to create viral content, all in one platform
				</p>
			</div>

			<!-- Features Grid -->
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				<!-- AI Animated Subtitles -->
				<div class="group p-6 bg-background rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
					<div class="flex items-center justify-between mb-4">
						<div class="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 9h6m-6 4h6m-6 4h4"/>
							</svg>
						</div>
						<span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Live</span>
					</div>
					<h4 class="text-lg font-semibold text-foreground mb-2">AI Animated Subtitles</h4>
					<p class="text-muted-foreground text-sm">Professional-grade animated captions that increase engagement by up to 80%. Choose from 50+ animation styles.</p>
				</div>

				<!-- Multi-Language Support -->
				<div class="group p-6 bg-background rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
					<div class="flex items-center justify-between mb-4">
						<div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
							</svg>
						</div>
						<span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Live</span>
					</div>
					<h4 class="text-lg font-semibold text-foreground mb-2">Multi-Language Support</h4>
					<p class="text-muted-foreground text-sm">Generate subtitles in 100+ languages with accurate transcription and cultural localization.</p>
				</div>

				<!-- Social Media Optimization -->
				<div class="group p-6 bg-background rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
					<div class="flex items-center justify-between mb-4">
						<div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
							</svg>
						</div>
						<span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Live</span>
					</div>
					<h4 class="text-lg font-semibold text-foreground mb-2">Social Media Optimization</h4>
					<p class="text-muted-foreground text-sm">Automatic aspect ratio adjustment and platform-specific formatting for optimal performance.</p>
				</div>

				<!-- Brand Customization -->
				<div class="group p-6 bg-background rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
					<div class="flex items-center justify-between mb-4">
						<div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
							</svg>
						</div>
						<span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Live</span>
					</div>
					<h4 class="text-lg font-semibold text-foreground mb-2">Brand Customization</h4>
					<p class="text-muted-foreground text-sm">Apply your brand colors, fonts, and logo to maintain consistency across all video content.</p>
				</div>

				<!-- Long-Form to Short-Form AI -->
				<div class="group p-6 bg-background rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
					<div class="flex items-center justify-between mb-4">
						<div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
							</svg>
						</div>
						<span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Beta</span>
					</div>
					<h4 class="text-lg font-semibold text-foreground mb-2">Long-Form to Short-Form AI</h4>
					<p class="text-muted-foreground text-sm">Automatically identify and extract the most engaging segments from long videos using AI analysis.</p>
				</div>

				<!-- Performance Analytics -->
				<div class="group p-6 bg-background rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
					<div class="flex items-center justify-between mb-4">
						<div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
							</svg>
						</div>
						<span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Beta</span>
					</div>
					<h4 class="text-lg font-semibold text-foreground mb-2">Performance Analytics</h4>
					<p class="text-muted-foreground text-sm">Track engagement metrics, audience insights, and content performance across platforms.</p>
				</div>
			</div>

			<!-- CTA -->
			<div class="text-center mt-12">
				<Button 
					onclick={() => window.location.href = '/features'}
					class="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-semibold"
				>
					View All Features
					<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
					</svg>
				</Button>
			</div>
		</div>
	</div>
</section>

<!-- Final CTA Section -->
<section class="py-20 bg-gradient-to-br from-primary/10 via-purple-500/10 to-primary/10">
	<div class="container mx-auto px-4 text-center">
		<div class="max-w-3xl mx-auto">
			<h2 class="text-3xl md:text-4xl font-bold text-foreground mb-6">
				Ready to Go Viral?
			</h2>
			<p class="text-lg text-muted-foreground mb-8">
				Join thousands of creators who are already using AutoReels to create engaging content that gets noticed.
			</p>
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
				<Button 
					onclick={handleAppClick}
					class="text-xl font-bold px-10 py-5 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary/25"
				>
					🚀 Start Creating Now
				</Button>
				<div class="text-sm text-muted-foreground">
					✨ Free forever • No credit card required
				</div>
			</div>
		</div>
	</div>
</section>


<style>
	@keyframes float {
		0%, 100% {
			transform: translateY(0px) rotate(0deg);
		}
		33% {
			transform: translateY(-15px) rotate(2deg);
		}
		66% {
			transform: translateY(-8px) rotate(-1deg);
		}
	}

	@keyframes gradient-x {
		0%, 100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	.animate-float {
		animation: float 6s ease-in-out infinite;
	}

	.animate-gradient-x {
		background-size: 200% 200%;
		animation: gradient-x 3s ease infinite;
	}

	.bg-grid-pattern {
		background-image: 
			linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
		background-size: 30px 30px;
	}

	.bg-noise {
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
	}

	/* Enhanced hover effects */
	.group:hover .group-hover\:scale-110 {
		transform: scale(1.1);
	}
</style>