<script lang="ts">
  import { onMount } from 'svelte';

  let { 
    message = '',
    type = 'success',
    duration = 3000,
    show = $bindable(false)
  } = $props();

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    if (show) {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Set new timeout to hide toast
      timeoutId = setTimeout(() => {
        show = false;
      }, duration);
    }
  });

  // Cleanup on destroy
  onMount(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  });

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black'
  };
</script>

{#if show}
  <div 
    class="fixed bottom-4 left-4 z-50 px-4 py-2 rounded-md shadow-lg transition-all duration-300 ease-in-out transform {typeStyles[type]}"
    class:translate-x-0={show}
    class:-translate-x-full={!show}
  >
    <div class="flex items-center gap-2">
      {#if type === 'success'}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      {:else if type === 'error'}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      {:else if type === 'info'}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      {:else if type === 'warning'}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      {/if}
      <span class="text-sm font-medium">{message}</span>
    </div>
  </div>
{/if}
