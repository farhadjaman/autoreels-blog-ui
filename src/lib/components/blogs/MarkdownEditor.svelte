<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import 'easymde/dist/easymde.min.css';
	import type EasyMDE from 'easymde';

	let { value = '', onChange = (v: string) => {}, isVisible = true } = $props<{
		value?: string;
		onChange?: (newValue: string) => void;
		isVisible?: boolean;
	}>();

	let textareaElement: HTMLTextAreaElement;
	let easymde: EasyMDE | null = null;
	let editorContainer: HTMLDivElement;

	export function insertText(text: string) {
		if (easymde) {
			const cm = easymde.codemirror;
			cm.replaceSelection(text);
		}
	}

	onMount(async () => {
		const { default: EasyMDEConstructor } = await import('easymde');

		if (textareaElement) {
			easymde = new EasyMDEConstructor({
				element: textareaElement,
				initialValue: value,
				spellChecker: false,
				placeholder: 'Write your blog post in Markdown...',
				minHeight: '400px', // Set a minimum height
				toolbar: [
					'bold',
					'italic',
					'heading',
					'|',
					'quote',
					'unordered-list',
					'ordered-list',
					'|',
					'link',
					'image',
					'|',
					'preview',
					'side-by-side',
					'fullscreen'
				]
			});

			easymde.codemirror.on('change', () => {
				if (easymde) {
					const updatedValue = easymde.value();
					onChange(updatedValue);
				}
			});
		}
	});

	// Update the editor value when the prop changes (important for synchronization)
	$effect(() => {
		if (easymde && easymde.value() !== value) {
			easymde.value(value);
		}
	});

	onDestroy(() => {
		if (easymde) {
			easymde.toTextArea();
			easymde = null;
		}
	});
</script>

<div bind:this={editorContainer} style="display: {isVisible ? 'block' : 'none'};">
	<textarea bind:this={textareaElement}></textarea>
</div>

<style>
    :global(.easymde-container .CodeMirror) {
        border-radius: 0 0 0.375rem 0.375rem;
        border-color: rgb(229 231 235);
        min-height: 400px;
    }
    :global(.easymde-container .editor-toolbar) {
        border-radius: 0.375rem 0.375rem 0 0;
        border-color: rgb(229 231 235);
    }
    :global(.easymde-container .editor-statusbar) {
        display: none;
    }
</style>