<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Toast } from '$lib/components/ui/toast';
  import { supabase } from '$lib/supabaseClient';

  // Props
  let { 
    open = $bindable(false), 
    onUploadComplete = () => {},
    bucket = 'autoreels',
    folder = 'assets',
    user = null
  } = $props();

  // State
  let selectedFile = $state<File | null>(null);
  let filePreview = $state<string | null>(null);
  let uploading = $state(false);
  let uploadError = $state<string | null>(null);
  let uploadedUrl = $state<string | null>(null);
  
  // Toast state
  let showToast = $state(false);
  let toastMessage = $state('');
  let toastType = $state('success');

  // Reset state when modal opens/closes
  $effect(() => {
    if (!open) {
      selectedFile = null;
      filePreview = null;
      uploading = false;
      uploadError = null;
      uploadedUrl = null;
    }
  });

  function onFileSelect(event: Event) {
    console.log('AssetUploadModal: File selected');
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    console.log('AssetUploadModal: Selected file:', file);
    
    if (!file) {
      console.log('AssetUploadModal: No file found');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('AssetUploadModal: Invalid file type:', file.type);
      uploadError = 'Please select a valid image file.';
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.log('AssetUploadModal: File too large:', file.size);
      uploadError = 'Image size must be less than 10MB.';
      return;
    }

    console.log('AssetUploadModal: File validation passed');
    selectedFile = file;
    uploadError = null;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      filePreview = e.target?.result as string;
      console.log('AssetUploadModal: Preview created');
    };
    reader.readAsDataURL(file);
  }

  async function uploadFile() {
    console.log('AssetUploadModal: uploadFile called');
    console.log('AssetUploadModal: selectedFile:', selectedFile);
    console.log('AssetUploadModal: user from props:', user);
    
    if (!selectedFile) {
      console.log('AssetUploadModal: No file selected');
      return;
    }
    
    if (!user) {
      console.log('AssetUploadModal: No user found in props');
      uploadError = 'You must be logged in to upload files';
      return;
    }

    try {
      console.log('AssetUploadModal: Starting upload...');
      uploading = true;
      uploadError = null;

      const userId = user.id;
      const ext = selectedFile.name.split('.').pop() || 'png';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const path = `${folder}/${userId}/${timestamp}-${randomId}.${ext}`;
      
      console.log('AssetUploadModal: Upload path:', path);

      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(path, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadErr) {
        console.error('AssetUploadModal: Upload error:', uploadErr);
        throw uploadErr;
      }

      console.log('AssetUploadModal: Upload successful, getting public URL...');
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      if (publicUrlData?.publicUrl) {
        console.log('AssetUploadModal: Public URL:', publicUrlData.publicUrl);
        uploadedUrl = publicUrlData.publicUrl;
        onUploadComplete(publicUrlData.publicUrl);
      }
    } catch (error: any) {
      console.error('AssetUploadModal: Upload failed:', error);
      uploadError = `Upload failed: ${error?.message || 'Unknown error'}`;
    } finally {
      uploading = false;
    }
  }

  function copyUrl() {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl).then(() => {
        toastMessage = 'URL copied to clipboard!';
        toastType = 'success';
        showToast = true;
      }).catch(() => {
        toastMessage = 'Failed to copy URL';
        toastType = 'error';
        showToast = true;
      });
    }
  }

  function uploadAnother() {
    selectedFile = null;
    filePreview = null;
    uploadError = null;
    uploadedUrl = null;
  }

  function closeModal() {
    open = false;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>
        {#if uploadedUrl}
          Upload Complete
        {:else}
          Upload Asset
        {/if}
      </Dialog.Title>
      <Dialog.Description>
        {#if uploadedUrl}
          Your asset has been uploaded successfully. You can copy the URL or upload another file.
        {:else}
          Select an image to upload to your assets. Maximum file size: 10MB
        {/if}
      </Dialog.Description>
    </Dialog.Header>
    
    <div class="grid gap-4 py-4">
      {#if uploadedUrl}
        <!-- Upload Success State -->
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label>Asset URL</Label>
            <div class="flex gap-2">
              <Input
                value={uploadedUrl}
                readonly
                class="font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onclick={copyUrl}
                class="cursor-pointer hover:scale-[0.98] transition-transform duration-150"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </Button>
            </div>
          </div>

          {#if filePreview}
            <div class="grid gap-2">
              <Label>Preview</Label>
              <div class="border rounded-md p-4 bg-gray-50">
                <img
                  src={filePreview}
                  alt="Uploaded asset"
                  class="max-w-full max-h-64 object-contain mx-auto"
                />
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <!-- Upload Form State -->
        <div class="grid gap-4">
          <!-- File input -->
          <div class="grid gap-2">
            <Label for="asset-file">Choose Image</Label>
            <Input
              id="asset-file"
              type="file"
              accept="image/*"
              onchange={onFileSelect}
            />
          </div>

          <!-- File preview -->
          {#if filePreview}
            <div class="grid gap-2">
              <Label>Preview</Label>
              <div class="border rounded-md p-4 bg-gray-50">
                <img
                  src={filePreview}
                  alt=""
                  class="max-w-full max-h-64 object-contain mx-auto"
                />
              </div>
            </div>
          {/if}

          <!-- Error message -->
          {#if uploadError}
            <div class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {uploadError}
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <Dialog.Footer>
      {#if uploadedUrl}
        <!-- Success state buttons -->
        <Button
          type="button"
          variant="outline"
          onclick={uploadAnother}
          class="cursor-pointer hover:scale-[0.98] transition-transform duration-150"
        >
          Upload Another
        </Button>
        <Button
          type="button"
          onclick={closeModal}
          class="cursor-pointer hover:scale-[0.98] transition-transform duration-150"
        >
          Close
        </Button>
      {:else}
        <!-- Upload form buttons -->
        <Button
          type="button"
          variant="outline"
          onclick={closeModal}
          disabled={uploading}
          class="cursor-pointer hover:scale-[0.98] transition-transform duration-150 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onclick={uploadFile}
          disabled={!selectedFile || uploading}
          class="cursor-pointer hover:scale-[0.98] transition-transform duration-150 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {#if uploading}
            <div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            Uploading...
          {:else}
            Upload Asset
          {/if}
        </Button>
      {/if}
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
