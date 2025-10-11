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
	<title>AutoReels: AI Powered Video Editing Platform</title>
	<meta name="description" content="Go viral with AI-powered animated subtitles. Elevate your videos with professional-grade animated captions, no design skills needed." />
</svelte:head>

<!-- Hero Section -->
<section class="relative py-16 md:py-24 flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
	<!-- Enhanced Background Elements -->
	<div class="absolute inset-0 -z-20">
		<!-- Animated Gradient Orbs -->
		<div class="absolute w-96 h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-glow top-1/4 left-1/4"></div>
		<div class="absolute w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse-glow bottom-1/4 right-1/4" style="animation-delay: 1s;"></div>
		
		<!-- Floating Social Icons with Enhanced Styling -->
		<div class="absolute inset-0">
			<!-- Instagram Icon -->
			<div class="absolute w-12 h-12 md:w-14 md:h-14 left-[15%] top-[18%] animate-float">
				<div class="w-full h-full bg-gradient-to-br from-pink-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
				</div>
			</div>
			
			<!-- Like Icon -->
			<div class="absolute w-10 h-10 md:w-12 md:h-12 left-[65%] top-[65%] animate-float" style="animation-delay: 0.5s;">
				<div class="w-full h-full bg-gradient-to-br from-red-500 via-pink-600 to-red-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
					❤️
				</div>
			</div>
			
			<!-- Thunder Icon -->
			<div class="absolute w-10 h-10 md:w-12 md:h-12 left-[35%] top-[15%] animate-float" style="animation-delay: 1s;">
				<div class="w-full h-full bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
					⚡
				</div>
			</div>
			
			<!-- TikTok Icon -->
			<div class="absolute w-11 h-11 md:w-13 md:h-13 right-[20%] top-[18%] animate-float" style="animation-delay: 1.5s;">
				<div class="w-full h-full bg-gradient-to-br from-black via-gray-800 to-black rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
				</div>
			</div>
			
			<!-- YouTube Icon -->
			<div class="absolute w-14 h-14 md:w-16 md:h-16 left-[18%] top-[65%] animate-float" style="animation-delay: 2s;">
				<div class="w-full h-full bg-gradient-to-br from-red-600 via-red-700 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
					<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
				</div>
			</div>
		</div>
		
		<!-- Enhanced Grid Pattern -->
		<div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
		
		<!-- Subtle Noise Texture -->
		<div class="absolute inset-0 bg-noise opacity-5"></div>
	</div>

	<!-- Main Content -->
	<div class="container mx-auto px-4 text-center relative z-10">
		<div class="max-w-5xl mx-auto">
			<!-- Enhanced Tagline -->
			<div class="mb-8 animate-fade-in">
				<span class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary rounded-full text-sm font-semibold border border-primary/20 backdrop-blur-sm">
					<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
					</svg>
					AI Powered Video Editing Platform
				</span>
			</div>

			<!-- Enhanced Main Title -->
			<h1 class="text-3xl md:text-7xl  font-black text-foreground mb-8 leading-tight tracking-tight animate-fade-in" style="animation-delay: 0.2s;">
				Go Viral with 
				<span class="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-gradient-x" aria-label="AI-Powered">
					AI-Powered
				</span>
				<br />
				<span class="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
					Animated Subtitles
				</span>
			</h1>

			<!-- Enhanced Subtitle -->
			<p class="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed font-medium animate-fade-in" style="animation-delay: 0.4s;">
				Elevate your videos with professional-grade animated captions, no design skills needed. 
				<span class="text-foreground font-semibold">Designed for creators to go viral.</span>
			</p>

			<!-- Enhanced CTA Section -->
			<div class="mb-12 animate-fade-in" style="animation-delay: 0.6s;">
				<div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
					<Button 
						onclick={handleAppClick}
						class="group relative text-xl font-bold px-10 py-5 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary/25 overflow-hidden"
						aria-label="Start creating animated subtitles for free"
					>
						<span class="relative z-10 flex items-center">
							🔥 Start for Free
							<svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
							</svg>
						</span>
						<div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
					</Button>
					
					<button 
						onclick={handleDemoClick}
						class="group flex items-center text-lg font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
						aria-label="Watch demo video"
					>
						<svg class="w-6 h-6 mr-2 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
							<path d="M8 5v14l11-7z"/>
						</svg>
						Watch Demo
					</button>
				</div>
				
				<!-- Enhanced Trust Indicators -->
				<div class="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
					<div class="flex items-center">
						<svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
						</svg>
						Trusted by 6000+ creators
					</div>
					<div class="flex items-center">
						<svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
						</svg>
						No credit card required
					</div>
					<div class="flex items-center">
						<svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
						</svg>
						Free forever plan
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="py-16 md:py-20 bg-muted/30">
	<div class="container mx-auto px-4">
		<div class="max-w-6xl mx-auto">
			<!-- Section Header -->
			<div class="text-center mb-12">
				<h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
					Built for Every Creator
				</h2>
				<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
					Discover how AutoReels empowers different types of creators with industry-specific solutions
				</p>
			</div>

			<!-- Use Cases Grid -->
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
			<div class="text-center mb-8">
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
			<div class="text-center mt-8">
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

<!-- Demo Section -->
<section id="demo-section" class="py-16 md:py-20 bg-background">
	<div class="container mx-auto px-4">
		<div class="max-w-4xl mx-auto text-center">
			<h2 class="text-3xl md:text-4xl font-bold text-foreground mb-6">
				See AutoReels in Action
			</h2>
			<p class="text-lg text-muted-foreground mb-8">
				Watch how easy it is to create professional animated subtitles that make your content go viral.
			</p>
			
			<!-- Demo Video Placeholder -->
			<div class="relative bg-muted rounded-2xl overflow-hidden shadow-2xl">
				<div class="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
					<button 
						class="group flex items-center justify-center w-20 h-20 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
						aria-label="Play demo video"
					>
						<svg class="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
							<path d="M8 5v14l11-7z"/>
						</svg>
					</button>
				</div>
				<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
			</div>
			
			<!-- Demo Features -->
			<div class="grid md:grid-cols-3 gap-8 mt-8">
				<div class="text-center">
					<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
						<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
						</svg>
					</div>
					<h3 class="font-semibold text-foreground mb-2">Upload Video</h3>
					<p class="text-sm text-muted-foreground">Simply drag and drop your video file</p>
				</div>
				<div class="text-center">
					<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
						<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
						</svg>
					</div>
					<h3 class="font-semibold text-foreground mb-2">AI Processing</h3>
					<p class="text-sm text-muted-foreground">Our AI automatically generates perfect subtitles</p>
				</div>
				<div class="text-center">
					<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
						<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
						</svg>
					</div>
					<h3 class="font-semibold text-foreground mb-2">Export & Share</h3>
					<p class="text-sm text-muted-foreground">Download and share your viral content</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Social Proof Section -->
<section class="py-12 md:py-16 bg-background">
	<div class="container mx-auto px-4">
		<div class="max-w-4xl mx-auto text-center">
			<h2 class="text-2xl md:text-3xl font-bold text-foreground mb-8">
				Trusted by Creators Worldwide
			</h2>
			
			<!-- Stats Grid -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
				<div class="text-center">
					<div class="text-3xl md:text-4xl font-bold text-primary mb-2">6K+</div>
					<div class="text-sm text-muted-foreground">Active Creators</div>
				</div>
				<div class="text-center">
					<div class="text-3xl md:text-4xl font-bold text-primary mb-2">1M+</div>
					<div class="text-sm text-muted-foreground">Videos Created</div>
				</div>
				<div class="text-center">
					<div class="text-3xl md:text-4xl font-bold text-primary mb-2">50M+</div>
					<div class="text-sm text-muted-foreground">Views Generated</div>
				</div>
				<div class="text-center">
					<div class="text-3xl md:text-4xl font-bold text-primary mb-2">4.9★</div>
					<div class="text-sm text-muted-foreground">User Rating</div>
				</div>
			</div>

			<!-- Testimonial -->
			<div class="bg-muted/50 rounded-2xl p-8 max-w-2xl mx-auto">
				<div class="flex items-center justify-center mb-4">
					<div class="flex text-yellow-400">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
						</svg>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
						</svg>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
						</svg>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
						</svg>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
						</svg>
					</div>
				</div>
				<blockquote class="text-lg text-foreground mb-4 italic">
					"AutoReels transformed my content creation process. My videos went from 1K to 100K views just by adding these amazing animated subtitles!"
				</blockquote>
				<div class="flex items-center justify-center">
					<div class="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
						SM
					</div>
					<div class="text-left">
						<div class="font-semibold text-foreground">Sarah Martinez</div>
						<div class="text-sm text-muted-foreground">Content Creator</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Final CTA Section -->
<section class="py-16 md:py-20 bg-gradient-to-br from-primary/10 via-purple-500/10 to-primary/10">
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