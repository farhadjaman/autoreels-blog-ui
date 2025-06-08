<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import * as Card from '$lib/components/ui/card';
  import * as Dialog from '$lib/components/ui/dialog';

  const { couponCode } = page.params;

  let coupon: any = null;
  let loading: boolean = true;
  let error: string | null = null;
  let deleteDialogOpen: boolean = false;
  let deleting: boolean = false;

  const API_BASE_URL = 'https://api.getautoreels.com';

  async function fetchCoupon(couponCode: string) {
    try {
      loading = true;
      error = null;
      const response = await fetch(`${API_BASE_URL}/coupons/${couponCode}`);
      
      if (response.status === 404) {
        error = 'Coupon not found';
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      coupon = await response.json();
      console.log('Coupon API Response:', coupon);
    } catch (err: any) {
      error = err.message;
      console.error('Error fetching coupon:', err);
    } finally {
      loading = false;
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function goBack() {
    goto('/');
  }

  function handleEdit() {
    goto(`/coupons/${coupon?.couponCode}/edit`);
  }

  function openDeleteDialog() {
    deleteDialogOpen = true;
  }

  function closeDeleteDialog() {
    deleteDialogOpen = false;
  }

  async function confirmDelete() {
    if (!coupon?.couponCode) return;

    try {
      deleting = true;
      const response = await fetch(`${API_BASE_URL}/coupons/${coupon.couponCode}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Coupon deleted:', result);
      
      // Close dialog and navigate back to main page
      closeDeleteDialog();
      goto('/');
    } catch (err: any) {
      alert(`Error deleting coupon: ${err.message}`);
      console.error('Error deleting coupon:', err);
    } finally {
      deleting = false;
    }
  }

  function isValidCoupon(coupon: any): boolean {
    if (!coupon) return false;
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validTo = new Date(coupon.validTo);
    return now >= validFrom && now <= validTo && coupon.status === 'active';
  }

  onMount(() => {
    if (couponCode) {
      fetchCoupon(couponCode);
    }
  });
</script>

<svelte:head>
  <title>{coupon ? `${coupon.couponCode} - Coupon Details` : 'Loading...'} - AutoReels</title>
</svelte:head>

<div class="container mx-auto p-6">
  <div class="space-y-6">
    <div class="flex items-center space-x-2">
      <Button variant="ghost" href="/" class="p-0">
        ← Back to Coupons
      </Button>
    </div>

    {#if loading}
      <div class="space-y-6">
        <div class="flex items-center justify-center py-8">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm text-muted-foreground">Loading coupon details...</span>
          </div>
        </div>
        <!-- Skeleton cards -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-4">
            <Skeleton class="h-32 w-full" />
            <Skeleton class="h-24 w-full" />
            <Skeleton class="h-24 w-full" />
          </div>
          <div class="space-y-4">
            <Skeleton class="h-48 w-full" />
          </div>
        </div>
      </div>
    {:else if error}
      <div class="flex flex-col items-center justify-center py-16 space-y-4">
        <div class="text-center space-y-2">
          <h2 class="text-xl font-semibold text-destructive">Error Loading Coupon</h2>
          <p class="text-muted-foreground">{error}</p>
        </div>
        <div class="flex space-x-2">
          <Button onclick={() => fetchCoupon(couponCode)} variant="outline">
            Try Again
          </Button>
          <Button onclick={goBack} variant="secondary">
            Back to Coupons
          </Button>
        </div>
      </div>
    {:else if coupon}
      <div class="flex flex-col gap-4 items-center justify-center">
        <!-- Header -->
        <div class="w-full mb-6 text-center">
          <h1 class="text-xl mb-2">{coupon.couponCode}</h1>
          <div class="flex flex-wrap items-center gap-2 justify-center">
            <Badge  class="text-md px-3" variant={coupon.status === 'active' ? 'default' : 'secondary'}>
              {coupon.status}
            </Badge>
            {#if isValidCoupon(coupon)}
              <Badge variant="default" class="bg-green-600 hover:bg-green-700 text-md px-3">
                Currently Valid
              </Badge>
            {:else}
              <Badge variant="secondary" class="bg-yellow-600 hover:bg-yellow-700 text-white text-md px-3">
                Not Valid
              </Badge>
            {/if}
            <Badge variant="outline" class="text-md px-3">
              {coupon.discountPercentage}% OFF
            </Badge>
          </div>
        </div>

        <!-- Consolidated Info Card -->
        <div class="w-full flex flex-col gap-4 justify-center items-center w-full">
          <Card.Root class="max-w-2xl w-full">
            <Card.Header>
              <Card.Title class="text-lg">Coupon Details</Card.Title>
            </Card.Header>
            <Card.Content class="space-y-4">
              <div class="flex justify-between items-center py-2 border-b">
                <span class="text-sm text-muted-foreground">Discount:</span>
                <span class="font-semibold">{coupon.discountPercentage}%</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b">
                <span class="text-sm text-muted-foreground">Status:</span>
                <Badge variant={coupon.status === 'active' ? 'default' : 'secondary'} class="text-xs">
                  {coupon.status}
                </Badge>
              </div>

              {#if coupon.packageCategory}
                <div class="flex justify-between items-center py-2 border-b">
                  <span class="text-sm text-muted-foreground">Category:</span>
                  <span class="font-semibold capitalize">{coupon.packageCategory.replace('_', ' ')}</span>
                </div>
              {/if}
              
              <div class="flex justify-between items-center py-2 border-b">
                <span class="text-sm text-muted-foreground">Packages:</span>
                <span class="font-semibold">{coupon.packages?.length || 0}</span>
              </div>

              {#if coupon.packages && coupon.packages.length > 0}
                <div class="py-2 border-b">
                  <span class="text-sm text-muted-foreground mb-2 block">Package IDs:</span>
                  <div class="flex flex-wrap gap-1">
                    {#each coupon.packages as pkg}
                      <Badge variant="outline" class="text-xs">{pkg}</Badge>
                    {/each}
                  </div>
                </div>
              {/if}
              
              <div class="flex justify-between items-center py-2 border-b">
                <span class="text-sm text-muted-foreground">Valid From:</span>
                <span class="font-semibold">{formatDate(coupon.validFrom)}</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b">
                <span class="text-sm text-muted-foreground">Valid Until:</span>
                <span class="font-semibold">{formatDate(coupon.validTo)}</span>
              </div>

              {#if coupon.affiliationInfo}
                <div class="flex justify-between items-center py-2 border-b">
                  <span class="text-sm text-muted-foreground">Affiliate Phone:</span>
                  <span class="font-semibold">{coupon.affiliationInfo.phone}</span>
                </div>
                
                <div class="flex justify-between items-center py-2 border-b">
                  <span class="text-sm text-muted-foreground">Commission:</span>
                  <span class="font-semibold">{coupon.affiliationInfo.percentage}%</span>
                </div>
              {/if}
              
                          <div class="flex justify-between items-center py-2">
              <span class="text-sm text-muted-foreground">Created:</span>
              <span class="font-semibold">{formatDate(coupon.createdAt)}</span>
            </div>
          </Card.Content>
        </Card.Root>
        
        <!-- Action Buttons outside card -->
        <div class="w-full flex gap-3 justify-center">
          <Button variant="default" onclick={() => handleEdit()}>
            Edit Coupon
          </Button>
          <Button variant="destructive" onclick={openDeleteDialog}>
            Delete Coupon
          </Button>
        </div>
      </div>
      </div>
    {/if}
  </div>
</div>

<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open={deleteDialogOpen}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Delete Coupon</Dialog.Title>
      <Dialog.Description>
        Are you sure you want to delete coupon "{coupon?.couponCode}"? This action cannot be undone.
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" onclick={closeDeleteDialog} disabled={deleting}>
        Cancel
      </Button>
      <Button variant="destructive" onclick={confirmDelete} disabled={deleting}>
        {#if deleting}
          <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
        {/if}
        Delete Coupon
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root> 