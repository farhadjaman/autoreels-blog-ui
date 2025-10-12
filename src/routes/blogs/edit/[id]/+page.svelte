<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { supabase } from '@/supabase/supabaseClient';
  import type { Tables, TablesInsert } from '$lib/types/database.types';
  import MarkdownPreview from '$lib/components/blogs/MarkdownPreview.svelte';
  import MarkdownEditor from '$lib/components/blogs/MarkdownEditor.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Label } from '$lib/components/ui/label';
  import { Switch } from '$lib/components/ui/switch';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel
  } from '$lib/components/ui/select';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
  } from '$lib/components/ui/card';

  const { id } = page.params;

  // --- Form state ---
  let post = $state<Partial<TablesInsert<'blogs'>>>({
    status: 'draft',
    featured: false,
    default_language: 'en'
  });
  let user = $state<any>(null);
  let i18n = $state<Partial<TablesInsert<'blogs_i18n'>>>({
    title: '',
    slug: '',
    language: 'en',
    content: '',
    description: '',
    translation_status: 'draft'
  });

  let loading = $state(false);
  let saving = $state(false);
  let errorMsg = $state<string | null>(null);
  let slugWarning = $state<string | null>(null);
  let uploadingImg = $state(false);
  let showPreview = $state(false);
  let editorComponent = $state<MarkdownEditor | null>(null);

  // --- Options ---
  const STATUSES = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ] as const;

  const LANGS = [
    { code: 'en', label: 'English' },
    { code: 'bn', label: 'বাংলা' }
  ] as const;

  const TRANSLATION_STATUSES = [
    { value: 'draft', label: 'Draft' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'published', label: 'Published' }
  ] as const;

  const languageLabel = $derived(LANGS.find((l) => l.code === i18n.language)?.label ?? 'Language');
  const statusLabel = $derived(STATUSES.find((s) => s.value === post.status)?.label ?? 'Status');
  const translationStatusLabel = $derived(
    TRANSLATION_STATUSES.find((t) => t.value === i18n.translation_status)?.label ?? 'Status'
  );
  const wordCount = $derived(i18n.content?.trim()?.split(/\s+/).filter(Boolean).length ?? 0);
  const charCount = $derived(i18n.content?.length ?? 0);

  function slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  $effect(() => {
    if (i18n.title && (!i18n.slug || i18n.slug === slugify(i18n.title))) {
      i18n.slug = slugify(i18n.title);
    }
  });

  $effect(() => {
    if (i18n.language) post.default_language = i18n.language;
  });

  async function loadPost() {
    try {
      loading = true;
      errorMsg = null;

      // Get user
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      user = supabaseUser;

      // Load blog post
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id || '')
        .single();

      if (blogError || !blogData) {
        errorMsg = 'Blog post not found';
        return;
      }

      // Load i18n content
      const { data: i18nData, error: i18nError } = await supabase
        .from('blogs_i18n')
        .select('*')
        .eq('post_id', id || '')
        .eq('language', blogData.default_language)
        .single();

      if (i18nError || !i18nData) {
        errorMsg = 'Blog content not found';
        return;
      }

      // Populate form
      post = {
        id: blogData.id,
        status: blogData.status,
        featured: blogData.featured,
        default_language: blogData.default_language,
        hero_image_url: blogData.hero_image_url
      };

      i18n = {
        post_id: i18nData.post_id,
        language: i18nData.language,
        title: i18nData.title,
        slug: i18nData.slug,
        content: i18nData.content,
        description: i18nData.description,
        translation_status: i18nData.translation_status,
        image_url: i18nData.image_url,
        meta_title: i18nData.meta_title,
        meta_description: i18nData.meta_description
      };
    } catch (err) {
      console.error('Error loading post:', err);
      errorMsg = 'An unexpected error occurred while loading the post.';
    } finally {
      loading = false;
    }
  }

  async function onImagePick(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      uploadingImg = true;
      const userId = user?.id ?? 'anon';
      const ext = file.name.split('.').pop() || 'png';
      const path = `blogs/${userId}/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage.from('blog-assets').upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from('blog-assets').getPublicUrl(path);

      if (editorComponent) {
        editorComponent.insertText(`\n![](${pub.publicUrl})\n`);
      }
    } catch (e: any) {
      alert(`Image upload failed: ${e?.message || e}`);
    } finally {
      uploadingImg = false;
      (event.target as HTMLInputElement).value = '';
    }
  }

  async function checkSlugUnique() {
    slugWarning = null;
    if (!i18n.slug || !i18n.language) return;
      const { data, error } = await supabase
        .from('blogs_i18n')
        .select('slug, language')
        .eq('slug', i18n.slug)
        .eq('language', i18n.language)
        .neq('post_id', id || '')
        .limit(1);
    if (!error && data && data.length > 0) {
      slugWarning = 'This slug already exists for the selected language.';
    }
  }

  async function savePost() {
    saving = true;
    errorMsg = null;

    if (!i18n.title?.trim()) {
      errorMsg = 'Title is required.';
      saving = false;
      return;
    }
    if (!i18n.slug?.trim()) {
      errorMsg = 'Slug is required.';
      saving = false;
      return;
    }
    if (!i18n.language) {
      errorMsg = 'Language is required.';
      saving = false;
      return;
    }
    if (!post.status) {
      errorMsg = 'Status is required.';
      saving = false;
      return;
    }

    try {
      // Update blog post
      const { error: postError } = await supabase
        .from('blogs')
        .update({
          status: post.status!,
          featured: !!post.featured,
          default_language: i18n.language!,
          hero_image_url: post.hero_image_url || null
        })
        .eq('id', id || '');

      if (postError) {
        throw new Error(`Failed to update post: ${postError.message}`);
      }

      // Update i18n content
      const { error: i18nError } = await supabase
        .from('blogs_i18n')
        .update({
          language: i18n.language!,
          title: i18n.title!.trim(),
          slug: i18n.slug!.trim(),
          content: i18n.content?.trim() || null,
          description: i18n.description?.trim() || null,
          translation_status: (i18n.translation_status as 'draft' | 'in_progress' | 'published') ?? 'draft',
          image_url: i18n.image_url || null,
          meta_title: i18n.meta_title?.trim() || null,
          meta_description: i18n.meta_description?.trim() || null
        })
        .eq('post_id', id || '')
        .eq('language', i18n.language);

      if (i18nError) {
        throw new Error(`Failed to update post content: ${i18nError.message}`);
      }

      goto('/blogs');
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
    } finally {
      saving = false;
    }
  }

  onMount(() => {
    loadPost();
  });
</script>

<div class="max-w-3xl mx-auto py-8">
  <Card>
    <CardHeader>
      <CardTitle>Edit Blog Post</CardTitle>
      <CardDescription>Update your blog post content and settings.</CardDescription>
    </CardHeader>

    <CardContent class="grid gap-6">
      {#if loading}
        <div class="space-y-4">
          <div class="space-y-2">
            <Skeleton class="h-4 w-20" />
            <Skeleton class="h-10 w-full" />
          </div>
          <div class="space-y-2">
            <Skeleton class="h-4 w-20" />
            <Skeleton class="h-10 w-full" />
          </div>
          <div class="space-y-2">
            <Skeleton class="h-4 w-20" />
            <Skeleton class="h-32 w-full" />
          </div>
        </div>
      {:else if errorMsg}
        <div class="text-center py-8">
          <p class="text-destructive mb-4">{errorMsg}</p>
          <Button onclick={loadPost} variant="outline">
            Try Again
          </Button>
        </div>
      {:else}
        <div class="grid gap-2">
          <Label for="title">Title *</Label>
          <Input
            id="title"
            placeholder="Your post title"
            required
            class={!i18n.title?.trim() && errorMsg ? 'border-red-500' : ''}
            value={i18n.title ?? ''}
            oninput={(e) => (i18n.title = e.currentTarget.value)}
          />
        </div>

        <div class="grid gap-2">
          <div class="flex items-center justify-between">
            <Label for="slug">Slug *</Label>
            {#if slugWarning}
              <span class="text-xs text-red-600">{slugWarning}</span>
            {/if}
          </div>
          <Input
            id="slug"
            placeholder="your-post-slug"
            required
            onblur={checkSlugUnique}
            class={!i18n.slug?.trim() && errorMsg ? 'border-red-500' : ''}
            value={i18n.slug ?? ''}
            oninput={(e) => (i18n.slug = e.currentTarget.value)}
          />
          <p class="text-xs text-muted-foreground">URL-friendly version of the title (auto-generated)</p>
        </div>

        <div class="grid gap-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Short description or excerpt for your post"
            rows={3}
            value={i18n.description ?? ''}
            oninput={(e) => (i18n.description = e.currentTarget.value)}
          />
          <p class="text-xs text-muted-foreground">Used for previews and SEO</p>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <div class="grid gap-2">
            <Label for="language">Language *</Label>
            <Select
              type="single"
              value={i18n.language}
              onValueChange={(v: string) => {
                if (v) i18n.language = v;
              }}
            >
              <SelectTrigger class="w-full">{languageLabel}</SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Language</SelectLabel>
                  {#each LANGS as l}
                    <SelectItem value={l.code}>{l.label}</SelectItem>
                  {/each}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label for="status">Post Status *</Label>
            <Select
              type="single"
              value={post.status}
              onValueChange={(v: string) => {
                if (v) post.status = v;
              }}
            >
              <SelectTrigger class="w-full">{statusLabel}</SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {#each STATUSES as s}
                    <SelectItem value={s.value}>{s.label}</SelectItem>
                  {/each}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label for="translation_status">Translation Status</Label>
            <Select
              type="single"
              value={i18n.translation_status}
              onValueChange={(v: string) => {
                if (v) i18n.translation_status = v;
              }}
            >
              <SelectTrigger class="w-full">{translationStatusLabel}</SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {#each TRANSLATION_STATUSES as t}
                    <SelectItem value={t.value}>{t.label}</SelectItem>
                  {/each}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="hero_image_url">Hero Image URL</Label>
            <Input
              id="hero_image_url"
              placeholder="https://example.com/image.png"
              type="url"
              value={post.hero_image_url ?? ''}
              oninput={(e) => (post.hero_image_url = e.currentTarget.value)}
            />
            <p class="text-xs text-muted-foreground">Main image for the blog post</p>
          </div>

          <div class="grid gap-2">
            <Label for="image_url">Content Image URL</Label>
            <Input
              id="image_url"
              placeholder="https://example.com/image.png"
              type="url"
              value={i18n.image_url ?? ''}
              oninput={(e) => (i18n.image_url = e.currentTarget.value)}
            />
            <p class="text-xs text-muted-foreground">
              Additional image for this language version
            </p>
          </div>
        </div>

        <div class="grid gap-2">
          <div class="flex items-center justify-between">
            <Label for="content">Content (Markdown)</Label>
            <div class="text-xs text-muted-foreground">{wordCount} words • {charCount} chars</div>
          </div>

          <div class="flex items-center justify-end gap-2 mb-2">
            <input id="imgPick" type="file" accept="image/*" class="hidden" onchange={onImagePick} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onclick={() => document.getElementById('imgPick')?.click()}
              disabled={uploadingImg}
            >
              {uploadingImg ? 'Uploading…' : 'Insert Image'}
            </Button>

            <Switch id="preview" checked={showPreview} onCheckedChange={(v) => (showPreview = v)} />
            <Label for="preview" class="text-xs">Preview</Label>
          </div>

          <div class="relative" style="min-height: 400px;">
            <MarkdownEditor
              bind:this={editorComponent}
              value={i18n.content || ''}
              onChange={(newValue) => {
                i18n.content = newValue;
              }}
              isVisible={!showPreview}
            />

            <div
              class="border rounded-md p-4 bg-white overflow-auto"
              style="display: {showPreview ? 'block' : 'none'}; min-height: 400px;"
            >
              <MarkdownPreview content={i18n.content || ''} />
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              placeholder="SEO title for search engines"
              value={i18n.meta_title ?? ''}
              oninput={(e) => (i18n.meta_title = e.currentTarget.value)}
            />
          </div>
          <div class="grid gap-2">
            <Label for="meta_description">Meta Description</Label>
            <Input
              id="meta_description"
              placeholder="SEO description for search engines"
              value={i18n.meta_description ?? ''}
              oninput={(e) => (i18n.meta_description = e.currentTarget.value)}
            />
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={!!post.featured}
            onCheckedChange={(v) => (post.featured = v)}
          />
          <Label for="featured">Featured Post</Label>
          <p class="text-xs text-muted-foreground ml-2">Mark as featured to highlight this post</p>
        </div>
      {/if}
    </CardContent>

    <CardFooter class="flex justify-between items-center">
      {#if errorMsg}
        <div class="text-sm text-red-500 flex-1 mr-4">
          <strong>Error:</strong>
          {errorMsg}
        </div>
      {:else}
        <div></div>
      {/if}

      <div class="flex gap-2">
        <Button variant="outline" onclick={() => goto('/blogs')} disabled={saving || loading}> 
          Cancel 
        </Button>

        <Button
          onclick={savePost}
          disabled={saving || loading ||
            !i18n.title?.trim() ||
            !i18n.slug?.trim() ||
            !i18n.language ||
            !post.status}
        >
          {#if saving}
            <div
              class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            ></div>
            Saving...
          {:else}
            Save Changes
          {/if}
        </Button>
      </div>
    </CardFooter>
  </Card>
</div>
