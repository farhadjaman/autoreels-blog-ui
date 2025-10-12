<script lang="ts">
	let { data, children } = $props()

	import '../app.css';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	// Navigation items
	const navItems = [
		{ name: 'Home', href: '/' },
		{ name: 'Features', href: '/features' },
		{ name: 'Pricing', href: '/pricing' },
		{ name: 'Blog', href: '/blogs' }
	];

	function handleAppClick() {
		window.open('https://app.autoreels.io', '_blank');
	}

	// Function to check if a nav item is active
	function isActive(href: string): boolean {
		const currentPath = page.url.pathname;
		
		// Special case for home page
		if (href === '/' && currentPath === '/') {
			return true;
		}
		
		// For other pages, check if current path starts with the href
		if (href !== '/' && currentPath.startsWith(href)) {
			return true;
		}
		
		return false;
	}
</script>

<!-- Header -->
<header class="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<div class="flex items-center space-x-2">
				<button 
					onclick={() => goto('/')}
					class="flex items-center space-x-3 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
				>
					<img src="/logo.svg" alt="AutoReels Logo" class="h-8 w-8" />
					<img src="/logo-text.png" alt="AutoReels" class="h-6" />
				</button>
			</div>

			<!-- Navigation -->
			<nav class="hidden md:flex items-center space-x-6">
				{#each navItems as item}
					<button
						onclick={() => goto(item.href)}
						class="text-sm font-medium transition-colors relative px-3 py-2 rounded-md
							{isActive(item.href) 
								? 'text-primary bg-primary/10 font-semibold' 
								: 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
					>
						{item.name}
					</button>
				{/each}
			</nav>

			<!-- CTA Button -->
			<div class="flex items-center space-x-4">
				<Button 
					onclick={handleAppClick}
					class="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
				>
				🚀 Start for Free
				</Button>
			</div>
		</div>
	</div>
</header>

<!-- Main Content -->
<main class="min-h-screen">
	{@render children()}
</main>

<!-- Footer -->
<footer class="bg-background border-t border-border">
	<div class="container mx-auto px-4 py-12">
		<div class="max-w-6xl mx-auto">
			<div class="grid md:grid-cols-4 gap-8">
				<!-- Brand -->
				<div class="md:col-span-2">
					<div class="flex items-center space-x-3 mb-4">
						<img src="/logo.svg" alt="AutoReels Logo" class="h-8 w-8" />
						<img src="/logo-text.png" alt="AutoReels" class="h-6" />
					</div>
					<p class="text-muted-foreground mb-4 max-w-md">
						The AI-powered platform that helps creators go viral with professional animated subtitles. No design skills needed.
					</p>
					<div class="flex space-x-4">
						<a href="https://twitter.com/autoreels" class="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
							</svg>
						</a>
						<a href="https://instagram.com/autoreels" class="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
							</svg>
						</a>
						<a href="https://youtube.com/autoreels" class="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
							</svg>
						</a>
					</div>
				</div>

				<!-- Product -->
				<div>
					<h3 class="font-semibold text-foreground mb-4">Product</h3>
					<ul class="space-y-2">
						<li><a href="/features" class="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
						<li><a href="/pricing" class="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
						<li><a href="/templates" class="text-muted-foreground hover:text-foreground transition-colors">Templates</a></li>
						<li><a href="/integrations" class="text-muted-foreground hover:text-foreground transition-colors">Integrations</a></li>
					</ul>
				</div>

				<!-- Support -->
				<div>
					<h3 class="font-semibold text-foreground mb-4">Support</h3>
					<ul class="space-y-2">
						<li><a href="/help" class="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
						<li><a href="/contact" class="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
						<li><a href="/status" class="text-muted-foreground hover:text-foreground transition-colors">Status</a></li>
						<li><a href="/community" class="text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
					</ul>
				</div>
			</div>

			<!-- Bottom Bar -->
			<div class="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
				<div class="text-sm text-muted-foreground mb-4 md:mb-0">
					© 2024 AutoReels. All rights reserved.
				</div>
				<div class="flex space-x-6 text-sm">
					<a href="/privacy" class="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
					<a href="/terms" class="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
					<a href="/cookies" class="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
				</div>
			</div>
		</div>
	</div>
</footer>