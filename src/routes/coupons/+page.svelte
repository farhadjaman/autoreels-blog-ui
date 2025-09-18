<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button } from '@/components/ui/button';
  import { Badge } from '@/components/ui/badge';
  import { Skeleton } from '@/components/ui/skeleton';
  import * as Table from '@/components/ui/table';

  let coupons: any[] = [];
  let loading: boolean = true;
  let error: string | null = null;

  const API_BASE_URL = 'https://api.getautoreels.com';

  async function fetchCoupons() {
    try {
      loading = true;
      const response = await fetch(`${API_BASE_URL}/coupons`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      coupons = data.coupons || [];
      console.log('Coupons loaded:', coupons.length);
    } catch (err: any) {
      error = err.message;
      console.error('Error fetching coupons:', err);
    } finally {
      loading = false;
    }
  }

  function handleCouponClick(couponCode: string) {
    goto(`/coupons/${couponCode}`);
  }

  function handleEdit(couponCode: string, event: Event) {
    event.stopPropagation();
    goto(`/coupons/${couponCode}/edit`);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  onMount(() => {
    fetchCoupons();
  });
</script>

<svelte:head>
  <title>Coupons - AutoReels</title>
</svelte:head>

<div class="container mx-auto p-6">
  <div class="space-y-6">
    <div class="flex flex-col space-y-2">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Coupons</h1>
          <p class="text-muted-foreground">Manage and view all available coupons</p>
        </div>
        <Button onclick={() => goto('/coupons/create')}>
          + Create New Coupon
        </Button>
      </div>
    </div>

    {#if loading}
      <div class="space-y-4">
        <div class="flex items-center justify-center py-8">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm text-muted-foreground">Loading coupons...</span>
          </div>
        </div>
        <!-- Skeleton table -->
        <div class="space-y-3">
          <Skeleton class="h-12 w-full" />
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
        </div>
      </div>
    {:else if error}
      <div class="flex flex-col items-center justify-center py-16 space-y-4">
        <div class="text-center space-y-2">
          <h2 class="text-xl font-semibold text-destructive">Error Loading Coupons</h2>
          <p class="text-muted-foreground">{error}</p>
        </div>
        <!-- @ts-ignore -->
        <Button onclick={fetchCoupons} variant="outline">
          Try Again
        </Button>
      </div>
    {:else if coupons.length === 0}
      <div class="flex flex-col items-center justify-center py-16 space-y-4">
        <div class="text-center space-y-2">
          <h2 class="text-xl font-semibold">No Coupons Found</h2>
          <p class="text-muted-foreground">There are currently no coupons available.</p>
        </div>
      </div>
    {:else}
      <div class="rounded-md border">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head class="w-[150px] py-4 px-4">Coupon Code</Table.Head>
              <Table.Head class="w-[100px] py-4 px-4">Status</Table.Head>
              <Table.Head class="w-[100px] text-right py-4 px-4">Discount</Table.Head>
              <Table.Head class="w-[150px] py-4 px-4">Category</Table.Head>
              <Table.Head class="w-[300px] py-4 px-4">Packages</Table.Head>
              <Table.Head class="w-[120px] py-4 px-4">Valid From</Table.Head>
              <Table.Head class="w-[120px] py-4 px-4">Valid To</Table.Head>
              <Table.Head class="w-[120px] py-4 px-4">Created</Table.Head>
              <Table.Head class="w-[100px] py-4 px-4">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each coupons as coupon}
              <Table.Row
                class="cursor-pointer hover:bg-muted/50 group"
                onclick={() => handleCouponClick(coupon.couponCode)}
                role="button"
                tabindex={0}
              >
                <Table.Cell class="font-medium py-4 px-4">
                  {coupon.couponCode}
                </Table.Cell>
                <Table.Cell class="py-4 px-4">
                  <Badge variant={coupon.status === 'active' ? 'default' : 'secondary'}>
                    {coupon.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell class="text-right font-semibold py-4 px-4">
                  {coupon.discountPercentage}%
                </Table.Cell>
                <Table.Cell class="capitalize py-4 px-4">
                  {#if coupon.packageCategory}
                    {coupon.packageCategory.replace('_', ' ')}
                  {:else}
                    <span class="text-muted-foreground">-</span>
                  {/if}
                </Table.Cell>
                <Table.Cell class="py-4 px-4">
                  <div class="flex flex-wrap gap-1 w-[280px]">
                    {#if coupon.packages && coupon.packages.length > 0}
                      {#each coupon.packages.slice(0, 2) as pkg}
                        <Badge variant="outline" class="text-xs truncate max-w-[130px]" title={pkg}>
                          {pkg.length > 20 ? pkg.substring(0, 20) + '...' : pkg}
                        </Badge>
                      {/each}
                      {#if coupon.packages.length > 2}
                        <Badge variant="outline" class="text-xs">+{coupon.packages.length - 2}</Badge>
                      {/if}
                    {:else}
                      <span class="text-muted-foreground text-sm">No packages</span>
                    {/if}
                  </div>
                </Table.Cell>
                <Table.Cell class="text-sm py-4 px-4">
                  {formatDate(coupon.validFrom)}
                </Table.Cell>
                <Table.Cell class="text-sm py-4 px-4">
                  {formatDate(coupon.validTo)}
                </Table.Cell>
                <Table.Cell class="text-sm text-muted-foreground py-4 px-4">
                  {formatDate(coupon.createdAt)}
                </Table.Cell>
                <Table.Cell class="py-4 px-4">
                  <!-- @ts-ignore -->
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onclick={(e) => handleEdit(coupon.couponCode, e)}
                  >
                    Edit
                  </Button>
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </div>
      
      <div class="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {coupons.length} coupon{coupons.length !== 1 ? 's' : ''}</span>
      </div>
    {/if}
  </div>
</div>
