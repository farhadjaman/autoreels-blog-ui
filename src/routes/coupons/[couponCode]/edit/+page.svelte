<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import * as Card from '$lib/components/ui/card';

  const { couponCode } = page.params;
  console.log('Edit component - received couponCode:', couponCode);

  let coupon = $state<any>(null);
  let loading = $state<boolean>(true);
  let saving = $state<boolean>(false);
  let error = $state<string | null>(null);

  let formCouponCode = $state('');
  let discountPercentage = $state('');
  let packages = $state('');
  let validFrom = $state('');
  let validTo = $state('');
  let packageCategory = $state('');
  let status = $state('active');

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
      console.log('Coupon loaded for editing:', coupon);
      
      // Populate editable fields
      formCouponCode = coupon.couponCode || '';
      discountPercentage = coupon.discountPercentage?.toString() || '';
      packages = coupon.packages ? coupon.packages.join(', ') : '';
      validFrom = coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : '';
      validTo = coupon.validTo ? new Date(coupon.validTo).toISOString().slice(0, 16) : '';
      packageCategory = coupon.packageCategory || '';
      status = coupon.status || 'active';
      
    } catch (err: any) {
      error = err.message;
      console.error('Error fetching coupon:', err);
    } finally {
      loading = false;
    }
  }

  function goBack() {
    goto(`/coupons/${couponCode}`);
  }

  function goToList() {
    goto('/coupons');
  }

  async function handleSave() {
    try {
      saving = true;
      error = null;

      // Updated coupon data
      const updatedCouponData = {
        couponCode: formCouponCode.trim(),
        discountPercentage: parseInt(discountPercentage),
        packages: packages ? packages.split(',').map(p => p.trim()) : [],
        validFrom: new Date(validFrom).toISOString(),
        validTo: new Date(validTo).toISOString(),
        packageCategory: packageCategory.trim(),
        status: status
      };

      const response = await fetch(`${API_BASE_URL}/coupons/${couponCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCouponData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Coupon updated:', result);
      
      // Navigate back to coupon details
      goto(`/coupons/${couponCode}`);
    } catch (err: any) {
      error = err.message;
      console.error('Error updating coupon:', err);
    } finally {
      saving = false;
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

  onMount(() => {
    if (couponCode) {
      fetchCoupon(couponCode);
    }
  });
</script>

<svelte:head>
  <title>Edit {coupon ? coupon.couponCode : 'Coupon'} - AutoReels</title>
</svelte:head>

<div class="container mx-auto p-6">
  <div class="space-y-6">
    <div class="flex items-center space-x-2">
      <Button variant="ghost" onclick={goBack} class="p-0">
        ← Back to Coupon
      </Button>
      <span class="text-muted-foreground">|</span>
      <Button variant="ghost" onclick={goToList} class="p-0">
        All Coupons
      </Button>
    </div>

    {#if loading}
      <div class="space-y-6">
        <div class="flex items-center justify-center py-8">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm text-muted-foreground">Loading coupon for editing...</span>
          </div>
        </div>
        <Skeleton class="h-96 w-full max-w-2xl mx-auto" />
      </div>
    {:else if error}
      <div class="flex flex-col items-center justify-center py-16 space-y-4">
        <div class="text-center space-y-2">
          <h2 class="text-xl font-semibold text-destructive">Error Loading Coupon</h2>
          <p class="text-muted-foreground">{error}</p>
        </div>
        <div class="flex space-x-2">
          <Button onclick={() => fetchCoupon(couponCode || '')} variant="outline">
            Try Again
          </Button>
          <Button onclick={goToList} variant="secondary">
            Back to Coupons
          </Button>
        </div>
      </div>
    {:else if coupon}
      <div class="flex flex-col gap-4 items-center justify-center">
        <div class="w-full mb-6 text-center">
          <h1 class="text-2xl font-bold">Edit Coupon: {coupon.couponCode}</h1>
          <div class="flex flex-wrap items-center gap-2 justify-center mt-2">
            <Badge variant={coupon.status === 'active' ? 'default' : 'secondary'}>
              {coupon.status}
            </Badge>
            <Badge variant="outline">
              {coupon.discountPercentage}% OFF
            </Badge>
          </div>
          <p class="text-muted-foreground mt-2">Edit coupon details below</p>
        </div>

        <!-- Read-only info -->
        <Card.Root class="max-w-2xl w-full mb-4">
          <Card.Header>
            <Card.Title class="text-lg">Creation Info</Card.Title>
          </Card.Header>
          <Card.Content>
            <div class="text-sm">
              <span class="text-muted-foreground">Created:</span> {formatDate(coupon.createdAt)}
            </div>
          </Card.Content>
        </Card.Root>

        <!-- Editable form -->
        <Card.Root class="max-w-2xl w-full">
          <Card.Header>
            <Card.Title class="text-lg">Edit Coupon Details</Card.Title>
          </Card.Header>
          <Card.Content class="space-y-4">
            <div class="space-y-2">
              <Label for="couponCode">Coupon Code *</Label>
              <Input
                id="couponCode"
                bind:value={formCouponCode}
                placeholder="e.g., SUMMER2024"
                required
              />
            </div>

            <div class="space-y-2">
              <Label for="discountPercentage">Discount Percentage *</Label>
              <Input
                id="discountPercentage"
                type="number"
                bind:value={discountPercentage}
                placeholder="e.g., 20"
                min="1"
                max="100"
                required
              />
            </div>

            <div class="space-y-2">
              <Label for="status">Status</Label>
              <select
                id="status"
                bind:value={status}
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div class="space-y-2">
              <Label for="packageCategory">Package Category *</Label>
              <Input
                id="packageCategory"
                bind:value={packageCategory}
                placeholder="e.g., NEW_USER, PREMIUM"
                required
              />
            </div>

            <div class="space-y-2">
              <Label for="packages">Package IDs *</Label>
              <Input
                id="packages"
                bind:value={packages}
                placeholder="PKG001, PKG002, PKG003"
                required
              />
              <p class="text-xs text-muted-foreground">Separate multiple package IDs with commas</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="validFrom">Valid From *</Label>
                <Input
                  id="validFrom"
                  type="datetime-local"
                  bind:value={validFrom}
                  required
                />
              </div>

              <div class="space-y-2">
                <Label for="validTo">Valid Until *</Label>
                <Input
                  id="validTo"
                  type="datetime-local"
                  bind:value={validTo}
                  required
                />
              </div>
            </div>

            {#if error}
              <div class="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p class="text-sm text-destructive">{error}</p>
              </div>
            {/if}
          </Card.Content>
        </Card.Root>

        <div class="w-full flex gap-3 justify-center">
          <Button variant="secondary" onclick={goBack} disabled={saving}>
            Cancel
          </Button>
          <Button onclick={handleSave} disabled={saving || !discountPercentage || !packages}>
            {#if saving}
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
            {/if}
            Save Changes
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div> 