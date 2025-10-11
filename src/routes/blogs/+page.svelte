<script lang="ts">
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';
  import type { Tables } from '$lib/types/database.types';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import * as Dialog from '$lib/components/ui/dialog';
  import MarkdownPreview from '$lib/components/blogs/MarkdownPreview.svelte';

  // --- Types for posts ---
  type PostRow = {
    id: Tables<'blogs'>['id'];
    created_at: Tables<'blogs'>['created_at'];
    updated_at: Tables<'blogs'>['updated_at'];
    author_id: Tables<'blogs'>['author_id'];
    featured: Tables<'blogs'>['featured'];
    status: Tables<'blogs'>['status'];
    language: Tables<'blogs_i18n'>['language'];
    title: Tables<'blogs_i18n'>['title'];
    slug: Tables<'blogs_i18n'>['slug'];
    description: Tables<'blogs_i18n'>['description'];
    content: Tables<'blogs_i18n'>['content'];
    image_url: Tables<'blogs_i18n'>['image_url'] | Tables<'blogs'>['hero_image_url'];
    meta_title: Tables<'blogs_i18n'>['meta_title'];
    meta_description: Tables<'blogs_i18n'>['meta_description'];
    translation_status: Tables<'blogs_i18n'>['translation_status'];
  };

  // --- Language options ---
  const LANGS = [
    { code: 'en', label: 'English' },
    { code: 'bn', label: 'বাংলা' }
  ] as const;

  let lang = $state<string>('en');
  let posts = $state<PostRow[]>([]);
  let loading = $state<boolean>(true);
  let errorMsg = $state<string | null>(null);
  let viewPost = $state<PostRow | null>(null);
  let deleteDialogOpen = $state<boolean>(false);
  let postToDelete = $state<PostRow | null>(null);
  let deleting = $state<boolean>(false);
  let searchQuery = $state<string>('');
  let selectedCategory = $state<string>('all');

  const selectedLangLabel = $derived(LANGS.find((l) => l.code === lang)?.label ?? 'Language');
  
  // Filter posts based on search and category
  const filteredPosts = $derived.by(() => {
    let filtered = posts;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(query) ||
        post.description?.toLowerCase().includes(query)
      );
    }
    
    // Filter by category (for now, we'll use 'all' since we don't have categories in Supabase)
    if (selectedCategory !== 'all') {
      // This would be implemented when categories are added to the database
      filtered = filtered;
    }
    
    return filtered;
  });

  // Get featured post
  const featuredPost = $derived.by(() => posts.find(post => post.featured));

  function fmtDate(d: string | null) {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  async function fetchPosts() {
    console.log('fetchPosts called, lang:', lang);
    loading = true;
    errorMsg = null;

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Fetch timeout reached');
      loading = false;
      errorMsg = 'Request timed out. Please try again.';
    }, 10000); // 10 second timeout

    try {
      // Test basic connection first
      console.log('Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('blogs')
        .select('id')
        .limit(1);
      
      if (testError) {
        console.error('Supabase connection test failed:', testError);
        errorMsg = `Database connection failed: ${testError.message}`;
        return;
      }
      
      console.log('Supabase connection test successful');
      const { data, error } = await supabase
        .from('blogs_i18n')
        .select(
          `
          language, title, slug, description, content, image_url,
          meta_title, meta_description, translation_status, created_at, updated_at,
          blogs!inner(id, created_at, updated_at, author_id, featured, status, hero_image_url)
        `
        )
        .eq('language', lang)
        .order('created_at', { ascending: false, foreignTable: 'blogs' });

      if (error) {
        console.error('Error fetching posts:', error);
        errorMsg = `Failed to load posts: ${error.message}`;
        posts = [];
        return;
      }

      console.log('Query successful, data:', data);
      
      if (!data) {
        console.log('No data returned');
        posts = [];
        return;
      }

      posts = data.map((row) => ({
        id: row.blogs.id,
        created_at: row.blogs.created_at,
        updated_at: row.blogs.updated_at,
        author_id: row.blogs.author_id,
        featured: row.blogs.featured,
        status: row.blogs.status,
        language: row.language,
        title: row.title,
        slug: row.slug,
        description: row.description,
        content: row.content,
        image_url: row.image_url ?? row.blogs.hero_image_url,
        meta_title: row.meta_title,
        meta_description: row.meta_description,
        translation_status: row.translation_status
      }));
    } catch (err) {
      console.error('Unexpected error:', err);
      errorMsg = 'An unexpected error occurred while loading posts.';
      posts = [];
    } finally {
      clearTimeout(timeoutId);
      console.log('fetchPosts completed, setting loading to false');
      loading = false;
    }
  }

  // Run initially and whenever `lang` changes
  $effect(() => {
    console.log('Effect triggered, lang:', lang);
    fetchPosts().catch(console.error);
  });

  // Also run on mount as a fallback
  fetchPosts().catch(console.error);

  function openPost(p: PostRow) {
    goto(`/${lang}/${p.slug}`);
  }

  function createNew() {
    goto('/blogs/new');
  }

  function onTitleKeydown(e: KeyboardEvent, p: PostRow) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPost(p);
    }
  }

  function viewPostPreview(p: PostRow) {
    viewPost = p;
  }

  function editPost(p: PostRow) {
    goto(`/blogs/edit/${p.id}`);
  }

  function openDeleteDialog(p: PostRow) {
    postToDelete = p;
    deleteDialogOpen = true;
  }

  function closeDeleteDialog() {
    deleteDialogOpen = false;
    postToDelete = null;
  }

  async function confirmDelete() {
    if (!postToDelete) return;

    try {
      deleting = true;
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', postToDelete.id);

      if (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
        return;
      }

      // Remove from local state
      posts = posts.filter(p => p.id !== postToDelete?.id);
      closeDeleteDialog();
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred while deleting the post.');
    } finally {
      deleting = false;
    }
  }

  function handleCategoryFilter(category: string) {
    selectedCategory = category;
  }

  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;
  }

  function handleAppClick() {
		window.open('https://app.autoreels.io', '_blank');
	}
</script>

<!-- Page header -->
<section class="py-16 px-6 mx-auto max-w-7xl">
  <div class="text-center mb-16">
    <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-6">The Blog</h1>
    <p class="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">Transcription, meeting, and productivity insights. Delivered by professionals.</p>
  </div>

  <!-- Featured Post Section -->
  {#if loading}
    <!-- Featured Post Skeleton -->
    <div class="mb-20">
      <div class="rounded-3xl bg-card border shadow-md overflow-hidden">
        <div class="grid md:grid-cols-2 gap-8 items-center p-8">
          <!-- Image skeleton -->
          <div class="flex items-center justify-center">
            <div class="relative w-full h-80 rounded-2xl overflow-hidden bg-gradient-to-r from-muted via-muted/50 to-muted">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
            </div>
          </div>

          <!-- Content skeleton -->
          <div class="space-y-6">
            <!-- Badge skeleton -->
            <div class="h-10 w-32 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full animate-pulse"></div>

            <!-- Title skeleton -->
            <div class="space-y-3">
              <div class="h-8 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse" style="width: 90%"></div>
              <div class="h-8 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse" style="width: 70%"></div>
            </div>

            <!-- Description skeleton -->
            <div class="space-y-2">
              <div class="h-5 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse"></div>
              <div class="h-5 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse"></div>
              <div class="h-5 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse" style="width: 80%"></div>
            </div>

            <!-- Author skeleton -->
            <div class="flex items-center gap-3 pt-4">
              <div class="w-10 h-10 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full animate-pulse"></div>
              <div class="space-y-1">
                <div class="h-4 w-20 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse"></div>
                <div class="h-3 w-24 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else if featuredPost}
    <div class="mb-20">
      <a href="/{lang}/{featuredPost.slug}" class="block group">
        <div class="rounded-3xl bg-card hover:scale-[0.98] transition-all duration-500 border  overflow-hidden">
          <div class="grid md:grid-cols-2 gap-8 items-center p-8">
            <div class="flex items-center justify-center">
              {#if featuredPost.image_url}
                <img 
                  src={featuredPost.image_url} 
                  alt={featuredPost.title || 'Featured blog post image'} 
                  class="w-full h-auto object-cover rounded-2xl max-h-80 shadow-lg" 
                  loading="eager"
                />
              {:else}
                <div class="w-full h-80 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center">
                  <span class="text-muted-foreground text-lg">No Image</span>
                </div>
              {/if}
            </div>

            <div class="space-y-6">
              <div>
                <span class="inline-block border border-primary/20 bg-primary/10 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider text-primary">
                  Featured Guide
                </span>
              </div>

              <h3 class="text-2xl sm:text-3xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h3>

              <p class="text-muted-foreground text-lg leading-relaxed">
                {featuredPost.description}
              </p>

              <div class="flex items-center gap-3 pt-4">
                <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span class="text-primary font-semibold text-sm">A</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-foreground">By Admin</p>
                  <p class="text-xs text-muted-foreground">AutoReels Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  {/if}

  <!-- Search and Filter Section -->
  <div class="flex flex-col lg:flex-row gap-8 items-center justify-between mb-16">
    <div class="flex-1 max-w-lg">
      <div class="relative">
        <input 
          type="search" 
          placeholder="Search articles..." 
          class="w-full pl-14 pr-4 py-4 text-base bg-background border-2 border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 shadow-sm" 
          oninput={handleSearchInput}
          value={searchQuery}
        />
        <svg class="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 justify-center lg:justify-end">
      <button 
        onclick={() => handleCategoryFilter('all')}
        class="px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 shadow-sm"
        class:bg-primary={selectedCategory === 'all'}
        class:text-primary-foreground={selectedCategory === 'all'}
        class:bg-muted={selectedCategory !== 'all'}
        class:text-muted-foreground={selectedCategory !== 'all'}
        class:hover:scale-105={selectedCategory !== 'all'}
      >
        All articles
      </button>
      <!-- Language selector -->
      <button 
        onclick={() => lang = lang === 'en' ? 'bn' : 'en'}
        class="px-6 py-3 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105 transition-all duration-300 text-sm font-medium shadow-sm"
      >
        {lang === 'en' ? 'বাংলা' : 'English'}
      </button>
    </div>
  </div>

</section>

  <!-- Error state -->
  {#if errorMsg}
    <div class="px-6 py-8">
      <div class="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 max-w-4xl mx-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <p class="font-semibold">Error loading blog posts</p>
              <p class="text-red-600">{errorMsg}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onclick={fetchPosts}
            class="text-red-700 border-red-300 hover:bg-red-100 cursor-pointer hover:scale-105 transition-all duration-200"
          >
            Retry
          </Button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Loading state -->
  {#if loading}
    <div class="px-6 py-8">

      <!-- Enhanced skeleton grid -->
      <div class="max-w-7xl mx-auto grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-6">
        {#each Array(6) as _, i}
          <div class="rounded-3xl bg-card p-6 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-500 animate-fade-in" style="animation-delay: {i * 100}ms;">
            <!-- Image skeleton with shimmer effect -->
            <div class="relative h-48 w-full rounded-2xl mb-6 overflow-hidden bg-gradient-to-r from-muted via-muted/50 to-muted">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
            </div>
            
            <!-- Content skeleton -->
            <div class="space-y-4">
              <!-- Badge skeleton -->
              <div class="h-8 w-20 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full animate-pulse"></div>
              
              <!-- Title skeleton with varying widths -->
              <div class="space-y-2">
                <div class="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse" style="width: {85 + (i % 3) * 5}%"></div>
                <div class="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse" style="width: {60 + (i % 2) * 10}%"></div>
              </div>
              
              <!-- Description skeleton -->
              <div class="space-y-2">
                <div class="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse"></div>
                <div class="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse" style="width: 90%"></div>
                <div class="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse" style="width: 75%"></div>
              </div>
            </div>
            
            <!-- Author skeleton -->
            <div class="mt-6 flex items-center gap-3 pt-4 border-t border-border/30">
              <div class="w-10 h-10 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full animate-pulse"></div>
              <div class="space-y-1">
                <div class="h-4 w-20 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse"></div>
                <div class="h-3 w-16 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        {/each}
      </div>

    </div>
  {:else}
    {#if filteredPosts.length === 0}
      <div class="px-6 py-16">
        <div class="max-w-2xl mx-auto text-center">
          <div class="w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg class="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-foreground mb-4">No blog posts found</h3>
          <p class="text-lg text-muted-foreground mb-8 leading-relaxed">
            {#if searchQuery}
              No posts match your search query "{searchQuery}".
            {:else if lang === 'en'}
              No published blog posts are available in English yet.
            {:else}
              No published blog posts are available in Bengali yet.
            {/if}
            <br />
            Try adjusting your search or check back later for new content.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onclick={() => lang = lang === 'en' ? 'bn' : 'en'}
              class="px-8 py-3 hover:scale-105 transition-all duration-200"
            >
              Switch to {lang === 'en' ? 'বাংলা' : 'English'}
            </Button>
          </div>
        </div>
      </div>
    {:else}
      <!-- Blog Grid -->
      <div class="px-6 pb-16 max-w-7xl mx-auto">
        <div class="grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {#each filteredPosts as p}
            <a
              href="/{lang}/{p.slug}"
              class="group rounded-3xl overflow-hidden border border-border bg-card hover:shadow-2xl hover:border-grey-300 transition-all duration-500 flex flex-col hover:scale-[0.98]"
            >
              <div class="relative h-0 pb-[56.25%] bg-muted overflow-hidden">
                {#if p.image_url}
                  <img
                    src={p.image_url}
                    class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={p.title || 'Blog post image'}
                    loading="lazy"
                    onerror={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target) target.style.display = 'none';
                    }}
                  />
                {:else}
                  <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <span class="text-muted-foreground text-lg">No Image</span>
                  </div>
                {/if}
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div class="p-8 flex flex-col flex-grow">
                <div class="mb-6">
                  <span class="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
                    Guide
                  </span>
                </div>

                <h3 class="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors mb-4">
                  {p.title || 'Untitled'}
                </h3>

                {#if p.description}
                  <p class="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                    {p.description}
                  </p>
                {/if}

                <div class="mt-auto pt-4 border-t border-border">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span class="text-primary font-semibold text-xs">A</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-foreground">By Admin</p>
                      <p class="text-xs text-muted-foreground">AutoReels Team</p>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  {/if}

<!-- View Post Modal -->
{#if viewPost}
  <Dialog.Root open={!!viewPost} onOpenChange={(open) => !open && (viewPost = null)}>
    <Dialog.Content class="max-w-4xl max-h-[90vh] overflow-y-auto">
      <Dialog.Header>
        <Dialog.Title class="text-2xl font-bold">{viewPost.title || 'Untitled'}</Dialog.Title>
        <Dialog.Description>
          {viewPost.description || 'No description available'}
        </Dialog.Description>
      </Dialog.Header>
      
      <div class="space-y-4">
        {#if viewPost.image_url}
          <img 
            src={viewPost.image_url} 
            alt={viewPost.title || 'Blog post image'} 
            class="w-full h-64 object-cover rounded-lg" 
          />
        {/if}
        
        <div class="prose prose-lg max-w-none">
          {#if viewPost.content}
            <MarkdownPreview content={viewPost.content} />
          {:else}
            <p class="text-gray-500 italic">No content available for this post.</p>
          {/if}
        </div>
      </div>
      
      <Dialog.Footer>
        <Button variant="outline" onclick={() => viewPost = null} class="cursor-pointer hover:scale-[0.98] transition-transform duration-150">
          Close
        </Button>
        <Button onclick={() => {
          const post = viewPost;
          viewPost = null;
          if (post) openPost(post);
        }} class="cursor-pointer hover:scale-[0.98] transition-transform duration-150">
          Open Full Post
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}

<!-- Delete Confirmation Modal -->
<Dialog.Root open={deleteDialogOpen} onOpenChange={(open) => !open && closeDeleteDialog()}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Delete Blog Post</Dialog.Title>
      <Dialog.Description>
        Are you sure you want to delete "{postToDelete?.title || 'this post'}"? This action cannot be undone.
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
          Delete Post
        {/if}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- Final CTA Section -->
<section class="py-20 bg-gradient-to-br from-primary/10 via-purple-500/10 to-primary/10">
	<div class="container mx-auto px-4 text-center">
		<div class="max-w-3xl mx-auto">
			<h2 class="text-3xl md:text-4xl font-bold text-foreground mb-6">
				Ready to Go Viral?
			</h2>
			<p class="text-lg text-muted-foreground mb-8">
				Join thousands of creators who are already using AutoReels to create engaging content that gets noticed.
			</p>
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
				<Button 
					onclick={handleAppClick}
					class="text-xl font-bold px-10 py-5 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary/25"
				>
					🚀 Start Creating Now
				</Button>
				<div class="text-sm text-muted-foreground">
					✨ Free forever • No credit card required
				</div>
			</div>
		</div>
	</div>
</section>

