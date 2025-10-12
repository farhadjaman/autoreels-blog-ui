<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase } from '@/supabase/supabaseClient.js';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Toast } from '$lib/components/ui/toast';
  import AssetUploadModal from '$lib/components/blogs/AssetUploadModal.svelte';

  // Get session from layout data
  let { data } = $props();

  // State
  let assets = $state(/** @type {any[]} */ ([]));
  let loading = $state(true);
  let errorMsg = $state('');
  let user = $state(/** @type {any} */ (null));
  let showUploadModal = $state(false);
  let deleteDialogOpen = $state(false);
  let assetToDelete = $state(/** @type {any} */ (null));
  let deleting = $state(false);
  
  // Toast state
  let showToast = $state(false);
  let toastMessage = $state('');
  let toastType = $state('success');

  // Get user on mount - authentication is handled by layout
  onMount(async () => {
    if (data.session && data.session.user) {
      user = data.session.user;
      await fetchAssets();
    } else {
      // Fallback: try to get user directly
      const { data: { user: supUser } } = await supabase.auth.getUser();
      if (supUser) {
        user = supUser;
        await fetchAssets();
      }
    }
  });

  async function fetchAssets() {
    if (!user) return;
    
    loading = true;
    errorMsg = '';

    try {
      // First, get the list of folders in the blogs directory
      const { data: folders, error: foldersError } = await supabase.storage
        .from('autoreels')
        .list('blogs', {
          limit: 100,
          offset: 0
        });

      if (foldersError) {
        console.error('Error fetching folders:', foldersError);
        errorMsg = `Failed to load folders: ${foldersError.message}`;
        assets = [];
        return;
      }

      // Get all files from all user folders
      let allFiles = /** @type {any[]} */ ([]);
      for (const folder of folders) {
        if (folder.metadata === null) { // This is a folder
          const { data: files, error: filesError } = await supabase.storage
            .from('autoreels')
            .list(`blogs/${folder.name}`, {
              limit: 100,
              offset: 0,
              sortBy: { column: 'created_at', order: 'desc' }
            });
          
          if (!filesError && files) {
            allFiles = [...allFiles, ...files.map(file => ({
              ...file,
              folderName: folder.name
            }))];
          }
        }
      }

      const data = allFiles;

      if (!data || data.length === 0) {
        assets = [];
      } else {
        // Filter out folders and only process actual files
        // Folders typically have null metadata or no size property
        const filesOnly = data.filter(file => {
          // Check if it's a file (has metadata with size) and not a folder
          return file.metadata !== null && 
                 file.metadata.size !== undefined && 
                 file.metadata.size > 0 &&
                 file.name.includes('.'); // Files typically have extensions
        });
        
        // Get public URLs for each asset
        const assetsWithUrls = await Promise.all(
          filesOnly.map(async (file) => {
            const { data: publicUrlData } = supabase.storage
              .from('autoreels')
              .getPublicUrl(`blogs/${file.folderName}/${file.name}`);
            
            return {
              ...file,
              publicUrl: publicUrlData.publicUrl,
              path: `blogs/${file.folderName}/${file.name}`,
              fullPath: `blogs/${file.folderName}/${file.name}`,
              // Ensure metadata is always an object with safe defaults
              metadata: file.metadata || { size: 0 }
            };
          })
        );

        assets = assetsWithUrls;
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      errorMsg = 'An unexpected error occurred while loading assets.';
      assets = [];
    } finally {
      loading = false;
    }
  }

  /**
   * @param {number} bytes
   */
  function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * @param {string} dateString
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * @param {string} filename
   */
  function getFileExtension(filename) {
    return filename.split('.').pop()?.toUpperCase() || '';
  }

  /**
   * @param {string} text
   */
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      toastMessage = 'URL copied to clipboard!';
      toastType = 'success';
      showToast = true;
    }).catch(() => {
      toastMessage = 'Failed to copy URL';
      toastType = 'error';
      showToast = true;
    });
  }

  /**
   * @param {any} asset
   */
  function openDeleteDialog(asset) {
    assetToDelete = asset;
    deleteDialogOpen = true;
  }

  function closeDeleteDialog() {
    deleteDialogOpen = false;
    assetToDelete = null;
  }

  async function confirmDelete() {
    if (!assetToDelete) return;

    try {
      deleting = true;
      const { error } = await supabase.storage
        .from('autoreels')
        .remove([`blogs/${assetToDelete?.folderName}/${assetToDelete?.name}`]);

      if (error) {
        console.error('Error deleting asset:', error);
        errorMsg = `Failed to delete asset: ${error.message}`;
        return;
      }

      // Remove from local state
      assets = assets.filter(a => a.name !== assetToDelete?.name);
      closeDeleteDialog();
    } catch (err) {
      console.error('Unexpected error:', err);
      errorMsg = 'An unexpected error occurred while deleting the asset.';
    } finally {
      deleting = false;
    }
  }

  /**
   * @param {string} url
   */
  function onUploadComplete(url) {
    // Refresh the assets list
    fetchAssets();
  }
</script>

<!-- Page header -->
<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 m-4">
  <div>
    <h1 class="text-2xl font-semibold tracking-tight">Assets</h1>
    <p class="text-muted-foreground">Manage your uploaded images and files</p>
  </div>

  <div class="flex items-center gap-3">
    <Button onclick={() => goto('/blogs')} variant="outline" class="cursor-pointer hover:scale-[0.98] transition-transform duration-150">
      ← Back to Blogs
    </Button>
    
    <Button onclick={() => showUploadModal = true} class="cursor-pointer hover:scale-[0.98] transition-transform duration-150">
      + Upload Asset
    </Button>
  </div>
</div>

<!-- Error state -->
{#if errorMsg}
  <div class="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-4 mx-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span>{errorMsg}</span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onclick={fetchAssets}
        class="text-red-700 border-red-300 hover:bg-red-100 cursor-pointer hover:scale-[0.98] transition-transform duration-150"
      >
        Retry
      </Button>
    </div>
  </div>
{/if}

<!-- Loading state -->
{#if loading}
  <div class="mx-4 mb-4">
    <div class="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-700">
      <div class="flex items-center gap-2">
        <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading assets...</span>
      </div>
    </div>
  </div>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-4">
    {#each Array(8) as _}
      <Card class="overflow-hidden">
        <Skeleton class="h-40 w-full" />
        <div class="p-4 space-y-3">
          <Skeleton class="h-5 w-3/4" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-5/6" />
        </div>
      </Card>
    {/each}
  </div>
{:else}
  {#if assets.length === 0}
    <Card class="p-8 mx-4 text-center">
      <CardHeader class="p-0 mb-4">
        <div class="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <CardTitle class="text-xl">No assets found</CardTitle>
        <CardDescription class="text-base">
          You haven't uploaded any assets yet. Click the "Upload Asset" button to get started.
        </CardDescription>
      </CardHeader>
      <CardContent class="p-0">
        <Button onclick={() => showUploadModal = true} class="cursor-pointer hover:scale-[0.98] transition-transform duration-150">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Upload Your First Asset
        </Button>
      </CardContent>
    </Card>
  {:else}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-4">
      {#each assets as asset}
        <Card class="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
          <!-- Asset Preview -->
          <div class="relative h-40 w-full overflow-hidden bg-gray-100">
            <img 
              src={asset.publicUrl} 
              alt={asset.name} 
              class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200" 
              loading="lazy"
              onerror={(e) => {
                const target = e.target;
                if (target && target instanceof HTMLImageElement) {
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex items-center justify-center h-full text-gray-400">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    `;
                  }
                }
              }}
            />
            <div class="absolute top-2 right-2">
              <Badge variant="secondary" class="text-xs">
                {getFileExtension(asset.name)}
              </Badge>
            </div>
          </div>

          <div class="p-4 flex flex-col gap-3 flex-1">
            <!-- File name -->
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="text-sm font-medium leading-tight line-clamp-2 flex-1">
                {asset.name}
              </h3>
            </div>

            <!-- File details -->
            <div class="space-y-1 text-xs text-muted-foreground">
              <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>{formatFileSize(asset.metadata?.size)}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(asset.created_at)}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-auto pt-2">
              <div class="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onclick={() => copyToClipboard(asset.publicUrl)}
                  class="flex-1 cursor-pointer hover:scale-[0.98] transition-transform duration-150"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy URL
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onclick={() => openDeleteDialog(asset)}
                  class="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer hover:scale-[0.98] transition-transform duration-150"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {/if}
{/if}

<!-- Upload Modal -->
<AssetUploadModal 
  bind:open={showUploadModal}
  onUploadComplete={onUploadComplete}
  bucket="autoreels"
  folder="blogs"
  user={user}
/>

<!-- Delete Confirmation Modal -->
<Dialog.Root open={deleteDialogOpen} onOpenChange={(open) => !open && closeDeleteDialog()}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Delete Asset</Dialog.Title>
      <Dialog.Description>
        Are you sure you want to delete "{assetToDelete?.name || 'this asset'}"? This action cannot be undone.
      </Dialog.Description>
    </Dialog.Header>
    
    <Dialog.Footer>
      <Button variant="outline" onclick={closeDeleteDialog} disabled={deleting} class="cursor-pointer hover:scale-[0.98] transition-transform duration-150 disabled:cursor-not-allowed disabled:hover:scale-100">
        Cancel
      </Button>
      <Button 
        variant="destructive" 
        onclick={confirmDelete} 
        disabled={deleting}
        class="cursor-pointer hover:scale-[0.98] transition-transform duration-150 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {#if deleting}
          <div class="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
          Deleting...
        {:else}
          Delete Asset
        {/if}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- Toast Notification -->
<Toast 
  bind:show={showToast}
  message={toastMessage}
  type={toastType}
  duration={3000}
/>