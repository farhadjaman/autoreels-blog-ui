<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { supabase } from '@/supabase/supabaseClient';
  import type { Tables } from '$lib/types/database.types';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
  import MarkdownPreview from '$lib/components/blogs/MarkdownPreview.svelte';

  const { lang, slug } = page.params;

  // Types for blog post
  type PostRow = {
    id: Tables<'blogs'>['id'];
    created_at: Tables<'blogs'>['created_at'];
    updated_at: Tables<'blogs'>['updated_at'];
    author_name: Tables<'blogs'>['author_name'];
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

  let post = $state<PostRow | null>(null);
  let loading = $state<boolean>(true);
  let error = $state<string | null>(null);

  function formatDate(d: string | null) {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  function goBack() {
    goto('/blogs');
  }

  async function fetchPost() {
    try {
      loading = true;
      error = null;

      const { data, error: fetchError } = await supabase
        .from('blogs_i18n')
        .select(`
          language, title, slug, description, content, image_url,
          meta_title, meta_description, translation_status, created_at, updated_at,
          blogs!inner(id, created_at, updated_at, author_name, featured, status, hero_image_url)
        `)
        .eq('language', lang || '')
        .eq('slug', slug || '')
        .single();

      if (fetchError) {
        console.error('Error fetching post:', fetchError);
        error = 'Post not found';
        return;
      }

      if (!data) {
        error = 'Post not found';
        return;
      }

      post = {
        id: data.blogs.id,
        created_at: data.blogs.created_at,
        updated_at: data.blogs.updated_at,
        author_name: data.blogs.author_name,
        featured: data.blogs.featured,
        status: data.blogs.status,
        language: data.language,
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        image_url: data.image_url ?? data.blogs.hero_image_url,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        translation_status: data.translation_status
      };
    } catch (err) {
      console.error('Unexpected error:', err);
      error = 'An unexpected error occurred while loading the post.';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchPost();
  });
</script>

<svelte:head>
  <title>{post?.title || 'Blog Post'} - AutoReels</title>
  {#if post?.meta_description}
    <meta name="description" content={post.meta_description} />
  {/if}
  {#if post?.meta_title}
    <meta property="og:title" content={post.meta_title} />
  {/if}
  {#if post?.description}
    <meta property="og:description" content={post.description} />
  {/if}
  {#if post?.image_url}
    <meta property="og:image" content={post.image_url} />
  {/if}
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Back button -->
    <div class="mb-6">
      <Button variant="outline" onclick={goBack} class="mb-4">
        ← Back to Blogs
      </Button>
    </div>

    {#if loading}
      <div class="space-y-6">
        <div class="space-y-4">
          <Skeleton class="h-8 w-3/4" />
          <Skeleton class="h-4 w-1/2" />
          <Skeleton class="h-4 w-1/3" />
        </div>
        <Skeleton class="h-64 w-full" />
        <div class="space-y-2">
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-3/4" />
        </div>
      </div>
    {:else if error}
      <Card class="p-8 text-center">
        <CardHeader>
          <CardTitle class="text-xl text-destructive">Error Loading Post</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground mb-4">{error}</p>
          <Button onclick={fetchPost} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    {:else if post}
      <article class="prose prose-lg max-w-none">
        <!-- Hero Image -->
        {#if post.image_url}
          <div class="mb-8">
            <img 
              src={post.image_url} 
              alt={post.title || 'Blog post image'} 
              class="w-full h-64 object-cover rounded-lg shadow-md" 
            />
          </div>
        {/if}

        <!-- Header -->
        <header class="mb-8">
          <div class="flex items-center gap-2 mb-4">
            {#if post.featured}
              <Badge variant="secondary">Featured</Badge>
            {/if}
            <Badge variant="outline" class="uppercase">{post.language}</Badge>
          </div>
          
          <h1 class="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title || 'Untitled'}
          </h1>
          
          {#if post.description}
            <p class="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.description}
            </p>
          {/if}

          <div class="flex items-center gap-4 text-sm text-gray-500 border-t border-b border-gray-200 py-4">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Published {formatDate(post.created_at)}</span>
            </div>
            {#if post.updated_at && post.updated_at !== post.created_at}
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Updated {formatDate(post.updated_at)}</span>
              </div>
            {/if}
          </div>
        </header>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          {#if post.content}
            <MarkdownPreview content={post.content} />
          {:else}
            <p class="text-gray-500 italic">No content available for this post.</p>
          {/if}
        </div>
      </article>
    {/if}
  </div>
</div>

<style>
  :global(.prose) {
    color: rgb(31 41 55);
  }
  
  :global(.prose h1) {
    color: rgb(17 24 39);
  }
  
  :global(.prose h2) {
    color: rgb(17 24 39);
    border-bottom: 1px solid rgb(229 231 235);
    padding-bottom: 0.5rem;
  }
  
  :global(.prose h3) {
    color: rgb(17 24 39);
  }
  
  :global(.prose a) {
    color: rgb(37 99 235);
    text-decoration: none;
  }
  
  :global(.prose a:hover) {
    text-decoration: underline;
  }
  
  :global(.prose blockquote) {
    border-left: 4px solid rgb(229 231 235);
    padding-left: 1rem;
    color: rgb(107 114 128);
    font-style: italic;
  }
  
  :global(.prose code) {
    background-color: rgb(243 244 246);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }
  
  :global(.prose pre) {
    background-color: rgb(243 244 246);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
  }
  
  :global(.prose pre code) {
    background-color: transparent;
    padding: 0;
  }
</style>
