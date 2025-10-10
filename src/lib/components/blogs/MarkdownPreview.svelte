<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { browser } from '$app/environment';

	// Use Svelte 5's $props to define the 'content' property for this component.
	let { content = '' } = $props<{ content?: string }>();

	let DOMPurify: any = null;
	let sanitizedHtml = $state('');
	let isLoaded = $state(false);

	// Configure the 'marked' library once.
	marked.setOptions({
		gfm: true, // Use GitHub Flavored Markdown
		breaks: true // Interpret single line breaks as <br> tags
	});

	// Load DOMPurify only on the client side
	onMount(async () => {
		if (browser) {
			try {
				const { default: DOMPurifyLib } = await import('dompurify');
				DOMPurify = DOMPurifyLib;
				isLoaded = true;
				// Process initial content
				updateSanitizedHtml();
			} catch (error) {
				console.error('Failed to load DOMPurify:', error);
				isLoaded = true; // Still mark as loaded to show fallback
				updateSanitizedHtml();
			}
		}
	});

	async function updateSanitizedHtml() {
		if (!browser) {
			// SSR fallback
			sanitizedHtml = await marked.parse(content || '');
			return;
		}

		const rawHtml = await marked.parse(content || '');

		if (DOMPurify) {
			sanitizedHtml = DOMPurify.sanitize(rawHtml);
		} else {
			// Fallback without sanitization if DOMPurify failed to load
			sanitizedHtml = rawHtml;
		}
	}

	// Update sanitized HTML when content changes
	$effect(() => {
		if (isLoaded || !browser) {
			updateSanitizedHtml();
		}
	});
</script>

<div class="markdown-preview-container">
	{#if browser && isLoaded}
		{@html sanitizedHtml}
	{:else if !browser}
		{@html sanitizedHtml}
	{:else}
		<div class="loading-placeholder">Loading preview...</div>
	{/if}
</div>

<style>
    .markdown-preview-container {
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
        line-height: 1.7;
        color: rgb(31 41 55); /* Tailwind's gray-800 */
        min-height: 400px;
    }

    .loading-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        color: rgb(107 114 128); /* gray-500 */
        font-style: italic;
    }

    .markdown-preview-container :global(h1) {
        font-size: 2.25rem; /* 36px */
        font-weight: 800;
        padding-bottom: 0.4em;
        border-bottom: 1px solid rgb(229 231 235); /* gray-200 */
        margin-top: 0;
        margin-bottom: 1.5rem;
    }

    .markdown-preview-container :global(h2) {
        font-size: 1.875rem; /* 30px */
        font-weight: 700;
        padding-bottom: 0.3em;
        border-bottom: 1px solid rgb(229 231 235); /* gray-200 */
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    .markdown-preview-container :global(h3) {
        font-size: 1.5rem; /* 24px */
        font-weight: 600;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    .markdown-preview-container :global(p) {
        margin-bottom: 1.25rem;
    }

    .markdown-preview-container :global(strong) {
        font-weight: 600;
    }

    .markdown-preview-container :global(ul),
    .markdown-preview-container :global(ol) {
        padding-left: 2em;
        margin-bottom: 1.25rem;
    }

    .markdown-preview-container :global(li) {
        margin-bottom: 0.5rem;
    }

    .markdown-preview-container :global(a) {
        color: rgb(37 99 235); /* blue-600 */
        text-decoration: none;
    }

    .markdown-preview-container :global(a:hover) {
        text-decoration: underline;
    }

    .markdown-preview-container :global(blockquote) {
        margin-left: 0;
        padding-left: 1em;
        border-left: 0.25em solid rgb(229 231 235); /* gray-200 */
        color: rgb(107 114 128); /* gray-500 */
    }

    /* Styling for code blocks */
    .markdown-preview-container :global(pre) {
        background-color: rgb(243 244 246); /* gray-100 */
        border-radius: 0.375rem; /* 6px */
        padding: 1rem;
        overflow-x: auto;
        margin-bottom: 1.25rem;
    }

    /* Styling for inline code snippets */
    .markdown-preview-container :global(code) {
        font-family: ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono',
        'Courier New', monospace;
        font-size: 0.875em;
        background-color: rgb(229 231 235); /* gray-200 */
        border-radius: 0.25rem; /* 4px */
        padding: 0.2em 0.4em;
    }

    /* Remove extra background for code inside a pre block */
    .markdown-preview-container :global(pre > code) {
        background-color: transparent;
        padding: 0;
    }
</style>