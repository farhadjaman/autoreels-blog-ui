<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';

  let couponCode = '';
  let discountPercentage = '';
  let packageCategory = '';
  let packages = '';
  let validFrom = '';
  let validTo = '';
  let loading = false;
  let error: string | null = null;

  const API_BASE_URL = 'https://api.getautoreels.com';

  function goBack() {
    goto('/');
  }

  async function handleSubmit() {
    try {
      loading = true;
      error = null;

      const couponData = {
        couponCode: couponCode.trim(),
        packages: packages ? packages.split(',').map(p => p.trim()) : [],
        discountPercentage: parseInt(discountPercentage),
        validFrom: new Date(validFrom).toISOString(),
        validTo: new Date(validTo).toISOString(),
        packageCategory: packageCategory.trim()
      };

      const response = await fetch(`${API_BASE_URL}/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(couponData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Coupon created:', result);
      
      // Navigate to the created coupon details page
      goto(`/coupons/${couponCode.trim()}`);
    } catch (err: any) {
      error = err.message;
      console.error('Error creating coupon:', err);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Create Coupon - AutoReels</title>
</svelte:head>

<div class="container mx-auto p-6">
  <div class="space-y-6">
    <div class="flex items-center space-x-2">
      <Button variant="ghost" onclick={goBack} class="p-0">
        ← Back to Coupons
      </Button>
    </div>

    <div class="flex flex-col gap-4 items-center justify-center">
      <div class="w-full mb-6 text-center">
        <h1 class="text-2xl font-bold">Create New Coupon</h1>
        <p class="text-muted-foreground">Fill in the details to create a new coupon</p>
      </div>

      <Card.Root class="max-w-2xl w-full">
        <Card.Header>
          <Card.Title class="text-lg">Coupon Details</Card.Title>
        </Card.Header>
        <Card.Content class="space-y-4">
          <div class="space-y-2">
            <Label for="couponCode">Coupon Code *</Label>
            <Input
              id="couponCode"
              bind:value={couponCode}
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
        <Button variant="secondary" onclick={goBack} disabled={loading}>
          Cancel
        </Button>
        <Button onclick={handleSubmit} disabled={loading || !couponCode || !discountPercentage || !validFrom || !validTo}>
          {#if loading}
            <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          {/if}
          Create Coupon
        </Button>
      </div>
    </div>
  </div>
</div> 