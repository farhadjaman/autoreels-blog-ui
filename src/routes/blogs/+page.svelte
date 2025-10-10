<script lang="ts">
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';
  import type { Tables } from '$lib/types/database.types';
  import { Button } from '$lib/components/ui/button';
  import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel
  } from '$lib/components/ui/select';
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

  const selectedLangLabel = $derived(LANGS.find((l) => l.code === lang)?.label ?? 'Language');

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
</script>

<!-- Page header -->
<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 m-4">
  <h1 class="text-2xl font-semibold tracking-tight">Blogs</h1>

  <div class="flex items-center gap-3">
    <Select 
      type="single"
      value={lang}
      onValueChange={(v: string) => {
        if (v) lang = v;
      }}
    >
      <SelectTrigger class="w-[160px]">
        {selectedLangLabel}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Language</SelectLabel>
          {#each LANGS as l}
            <SelectItem value={l.code}>{l.label}</SelectItem>
          {/each}
        </SelectGroup>
      </SelectContent>
    </Select>

    <Button onclick={createNew} class="cursor-pointer hover:scale-[0.98] transition-transform duration-150">
      + New Blog
    </Button>
    
    <Button onclick={() => goto('/blogs/assets')} variant="outline" class="cursor-pointer hover:scale-[0.98] transition-transform duration-150">
      Assets
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
        onclick={fetchPosts}
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
        <span>Loading blog posts...</span>
      </div>
    </div>
  </div>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mx-4">
    {#each Array(6) as _}
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
  {#if posts.length === 0}
    <Card class="p-8 mx-4 text-center">
      <CardHeader class="p-0 mb-4">
        <div class="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <CardTitle class="text-xl">No blog posts found</CardTitle>
        <CardDescription class="text-base">
          {#if lang === 'en'}
            No published blog posts are available in English yet.
          {:else}
            No published blog posts are available in Bengali yet.
          {/if}
          <br />
          Try switching languages or create your first blog post.
        </CardDescription>
      </CardHeader>
      <CardContent class="p-0">
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onclick={createNew} class="w-full sm:w-auto cursor-pointer hover:scale-[0.98] transition-transform duration-150">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Blog
          </Button>
          <Button 
            variant="outline" 
            onclick={() => lang = lang === 'en' ? 'bn' : 'en'}
            class="w-full sm:w-auto cursor-pointer hover:scale-[0.98] transition-transform duration-150"
          >
            Switch to {lang === 'en' ? 'বাংলা' : 'English'}
          </Button>
        </div>
      </CardContent>
    </Card>
  {:else}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mx-4">
      {#each posts as p}
        <Card class="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
          {#if p.image_url}
            <div class="relative h-40 w-full overflow-hidden">
              <img 
                src={p.image_url} 
                alt={p.title || 'Blog post image'} 
                class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200" 
                loading="lazy"
                onerror={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target) target.style.display = 'none';
                }}
              />
            </div>
          {/if}

          <div class="p-4 flex flex-col gap-3 flex-1">
            <div class="flex items-start justify-between gap-2 mb-2">
              <!-- Accessible clickable title -->
              <button
                type="button"
                class="text-left text-lg font-semibold leading-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors duration-200 flex-1"
                onclick={() => openPost(p)}
                onkeydown={(e) => onTitleKeydown(e, p)}
                aria-label={`Open post: ${p.title || 'Untitled'}`}
                tabindex="0"
              >
                {p.title || 'Untitled'}
              </button>

              <div class="flex items-center gap-2 shrink-0">
                {#if p.featured}
                  <Badge variant="secondary">Featured</Badge>
                {/if}
                <div class="flex items-center gap-1 text-xs text-muted-foreground">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{fmtDate(p.created_at)}</span>
                </div>
                <div class="flex items-center gap-1 text-xs text-muted-foreground">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span class="uppercase font-medium">{p.language}</span>
                </div>
              </div>
            </div>

            {#if p.description}
              <p class="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{p.description}</p>
            {/if}

            <div class="mt-auto pt-2">
              <!-- Action Buttons -->
              <div class="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onclick={() => viewPostPreview(p)}
                  class="flex-1 cursor-pointer hover:scale-[0.98] transition-transform duration-150"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onclick={() => editPost(p)}
                  class="flex-1 cursor-pointer hover:scale-[0.98] transition-transform duration-150"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onclick={() => openDeleteDialog(p)}
                  class="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer hover:scale-[0.98] transition-transform duration-150"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      {/each}
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