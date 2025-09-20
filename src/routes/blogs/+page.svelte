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

  // --- Types for posts ---
  type PostRow = {
    id: Tables<'blogs'>['id'];
    created_at: Tables<'blogs'>['created_at'];
    updated_at: Tables<'blogs'>['updated_at'];
    author_id: Tables<'blogs'>['author_id'];
    featured: Tables<'blogs'>['featured'];
    status: 'draft' | 'published' | 'archived';
    language: Tables<'blogs_i18n'>['language'];
    title: Tables<'blogs_i18n'>['title'];
    slug: Tables<'blogs_i18n'>['slug'];
    description: Tables<'blogs_i18n'>['description'];
    content: Tables<'blogs_i18n'>['content'];
    image_url: Tables<'blogs_i18n'>['image_url'] | Tables<'blogs'>['hero_image_url'];
    meta_title: Tables<'blogs_i18n'>['meta_title'];
    meta_description: Tables<'blogs_i18n'>['meta_description'];
    translation_status: 'draft' | 'in_progress' | 'published';
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

  const selectedLangLabel = $derived(LANGS.find((l) => l.code === lang)?.label ?? 'Language');

  function fmtDate(d: string | null) {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  async function fetchPosts() {
    loading = true;
    errorMsg = null;

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
      .eq('translation_status', 'published')
      .eq('blogs.status', 'published')
      .order('created_at', { ascending: false, foreignTable: 'blogs' });

    if (error) {
      errorMsg = error.message;
      posts = [];
    } else {
      posts = (data ?? []).map((row: any) => ({
        id: row.blogs.id,
        created_at: row.blogs.created_at,
        updated_at: row.blogs.updated_at,
        author_id: row.blogs.author_id,
        featured: row.blogs.featured,
        status: row.blogs.status as PostRow['status'],
        language: row.language,
        title: row.title,
        slug: row.slug,
        description: row.description,
        content: row.content,
        image_url: row.image_url ?? row.blogs.hero_image_url,
        meta_title: row.meta_title,
        meta_description: row.meta_description,
        translation_status: row.translation_status as PostRow['translation_status']
      }));
    }

    loading = false;
  }

  // Run initially and whenever `lang` changes
  $effect(() => {
    fetchPosts();
  });

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
</script>

<!-- Page header -->
<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 m-4">
  <h1 class="text-2xl font-semibold tracking-tight">Blogs</h1>

  <div class="flex items-center gap-3">
    <Select bind:value={lang}>
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

    <Button onclick={createNew}>
      + New Blog
    </Button>
  </div>
</div>

<!-- Error state -->
{#if errorMsg}
  <div class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4">
    {errorMsg}
  </div>
{/if}

<!-- Loading state -->
{#if loading}
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
    <Card class="p-6 mx-4">
      <CardHeader class="p-0 mb-2">
        <CardTitle>No posts yet</CardTitle>
        <CardDescription>Switch language or create your first blog post.</CardDescription>
      </CardHeader>
      <CardContent class="p-0 pt-2">
        <Button onclick={createNew}>Create a Blog</Button>
      </CardContent>
    </Card>
  {:else}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mx-4">
      {#each posts as p}
        <Card class="flex flex-col overflow-hidden">
          {#if p.image_url}
            <img src={p.image_url} alt={p.title} class="h-40 w-full object-cover" loading="lazy" />
          {/if}

          <div class="p-4 flex flex-col gap-2 flex-1">
            <div class="flex items-center justify-between gap-2">
              <!-- Accessible clickable title -->
              <button
                type="button"
                class="text-left text-lg font-semibold leading-tight line-clamp-2 cursor-pointer hover:underline"
                onclick={() => openPost(p)}
                onkeydown={(e) => onTitleKeydown(e, p)}
                aria-label={`Open post ${p.title || 'Untitled'}`}
              >
                {p.title}
              </button>

              {#if p.featured}
                <Badge variant="secondary">Featured</Badge>
              {/if}
            </div>

            {#if p.description}
              <p class="text-sm text-muted-foreground line-clamp-3">{p.description}</p>
            {/if}

            <div class="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
              <span>{fmtDate(p.created_at)}</span>
              <span class="uppercase">{p.language}</span>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {/if}
{/if}