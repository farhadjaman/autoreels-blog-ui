<script lang="ts">

  let { data } = $props()
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type { TablesInsert } from '$lib/types/database.types';
  import MarkdownPreview from '$lib/components/blogs/MarkdownPreview.svelte';
  import MarkdownEditor from '$lib/components/blogs/MarkdownEditor.svelte';
  import AssetUploadModal from '$lib/components/blogs/AssetUploadModal.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Label } from '$lib/components/ui/label';
  import { Switch } from '$lib/components/ui/switch';
  import { Badge } from '$lib/components/ui/badge';
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
  import * as Dialog from '$lib/components/ui/dialog';

  // --- Form state ---
  let post = $state<Partial<TablesInsert<'blogs'>>>({
    status: 'draft',
    featured: false,
    default_language: 'en'
  });
  let user = $state<any>(null)
  let i18n = $state<Partial<TablesInsert<'blogs_i18n'>>>({
    title: '',
    slug: '',
    language: 'en',
    content: '',
    description: '',
    translation_status: 'draft'
  });

  // Categories and Tags state
  let categories = $state<Array<{id: number, name: string, slug: string}>>([]);
  let tags = $state<Array<{id: number, name: string, slug: string}>>([]);
  let selectedCategories = $state<number[]>([]);
  let selectedTags = $state<number[]>([]);
  let newTag = $state('');
  let newCategory = $state('');

  const supabase = $derived(data.supabase);

  $effect(()=>{
    supabase.auth.getUser().then((supUser) => {
      if (supUser) {
        user = supUser.data.user;
      }
    })

  })


  let loading = $state(false);
  let errorMsg = $state<string | null>(null);
  let slugWarning = $state<string | null>(null);
  let uploadingImg = $state(false);
  let showPreview = $state(false);
  let autoSaveStatus = $state<'saved' | 'saving' | 'error' | null>(null);
  let lastSaved = $state<Date | null>(null);
  let autoSaveInterval: ReturnType<typeof setInterval> | null = null;

  // Image upload modal state
  let showImageModal = $state(false);

  // Add a reference for the editor component instance
  let editorComponent: MarkdownEditor;

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

  // Load categories and tags on mount
  onMount(async () => {
    loadDraft(); // Load any existing draft first
    await loadCategoriesAndTags();
    startAutoSave();
  });

  async function loadCategoriesAndTags() {
    try {
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories_i18n')
        .select('category_id, name, slug')
        .eq('language', i18n.language || 'en');

      if (!categoriesError && categoriesData) {
        categories = categoriesData.map(cat => ({
          id: cat.category_id,
          name: cat.name,
          slug: cat.slug
        }));
      }

      // Load tags
      const { data: tagsData, error: tagsError } = await supabase
        .from('tags_i18n')
        .select('tag_id, name, slug')
        .eq('language', i18n.language || 'en');

      if (!tagsError && tagsData) {
        tags = tagsData.map(tag => ({
          id: tag.tag_id,
          name: tag.name,
          slug: tag.slug
        }));
      }
    } catch (error) {
      console.error('Error loading categories and tags:', error);
    }
  }

  // Auto-save functionality
  function startAutoSave() {
    autoSaveInterval = setInterval(async () => {
      if (i18n.title?.trim() && i18n.content?.trim()) {
        await autoSave();
      }
    }, 30000); // Auto-save every 30 seconds
  }

  async function autoSave() {
    if (!i18n.title?.trim() || !i18n.content?.trim()) return;
    
    try {
      autoSaveStatus = 'saving';
      
      // Save to localStorage as backup
      const draftData = {
        post,
        i18n,
        selectedCategories,
        selectedTags,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('blog_draft', JSON.stringify(draftData));
      
      autoSaveStatus = 'saved';
      lastSaved = new Date();
      
      // Clear status after 3 seconds
      setTimeout(() => {
        autoSaveStatus = null;
      }, 3000);
    } catch (error) {
      autoSaveStatus = 'error';
      console.error('Auto-save failed:', error);
    }
  }

  // Load draft from localStorage on mount
  function loadDraft() {
    try {
      const draftData = localStorage.getItem('blog_draft');
      if (draftData) {
        const parsed = JSON.parse(draftData);
        // Only load if it's recent (within 24 hours)
        const draftTime = new Date(parsed.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - draftTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          post = { ...post, ...parsed.post };
          i18n = { ...i18n, ...parsed.i18n };
          selectedCategories = parsed.selectedCategories || [];
          selectedTags = parsed.selectedTags || [];
          lastSaved = draftTime;
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }

  // Image upload functions
  function openImageModal() {
    showImageModal = true;
  }

  function onImageUploadComplete(url: string) {
    // Insert image into editor
    if (editorComponent) {
      editorComponent.insertText(`\n![](${url})\n`);
    }
  }

  // --- Optional: slug uniqueness check per language ---
  async function checkSlugUnique() {
    slugWarning = null;
    if (!i18n.slug || !i18n.language) return;
    const { data, error } = await supabase
      .from('blogs_i18n')
      .select('slug, language')
      .eq('slug', i18n.slug)
      .eq('language', i18n.language)
      .limit(1);
    if (!error && data && data.length > 0) {
      slugWarning = 'This slug already exists for the selected language.';
    }
  }

  // Category and Tag management functions
  function toggleCategory(categoryId: number) {
    if (selectedCategories.includes(categoryId)) {
      selectedCategories = selectedCategories.filter(id => id !== categoryId);
    } else {
      selectedCategories = [...selectedCategories, categoryId];
    }
  }

  function toggleTag(tagId: number) {
    if (selectedTags.includes(tagId)) {
      selectedTags = selectedTags.filter(id => id !== tagId);
    } else {
      selectedTags = [...selectedTags, tagId];
    }
  }

  async function createNewTag() {
    if (!newTag.trim()) return;
    
    try {
      const slug = slugify(newTag);
      
      // Create tag
      const { data: newTagData, error: tagError } = await supabase
        .from('tags')
        .insert({})
        .select('id')
        .single();

      if (tagError) {
        console.error('Tag creation error:', tagError);
        throw new Error(`Failed to create tag: ${tagError.message}`);
      }

      if (!newTagData) {
        throw new Error('Failed to create tag: No data returned');
      }

      // Create tag translation
      const { error: i18nError } = await supabase
        .from('tags_i18n')
        .insert({
          tag_id: newTagData.id,
          language: i18n.language!,
          name: newTag.trim(),
          slug: slug
        });

      if (i18nError) {
        console.error('Tag i18n creation error:', i18nError);
        // Try to clean up the created tag
        await supabase.from('tags').delete().eq('id', newTagData.id);
        throw new Error(`Failed to create tag translation: ${i18nError.message}`);
      }

      // Add to local state
      tags = [...tags, { id: newTagData.id, name: newTag.trim(), slug }];
      selectedTags = [...selectedTags, newTagData.id];
      newTag = '';
    } catch (error) {
      console.error('Error creating tag:', error);
      errorMsg = error instanceof Error ? error.message : 'Failed to create tag';
    }
  }

  async function createNewCategory() {
    if (!newCategory.trim()) return;
    
    try {
      const slug = slugify(newCategory);
      
      // Create category
      const { data: newCategoryData, error: categoryError } = await supabase
        .from('categories')
        .insert({})
        .select('id')
        .single();

      if (categoryError) {
        console.error('Category creation error:', categoryError);
        throw new Error(`Failed to create category: ${categoryError.message}`);
      }

      if (!newCategoryData) {
        throw new Error('Failed to create category: No data returned');
      }

      // Create category translation
      const { error: i18nError } = await supabase
        .from('categories_i18n')
        .insert({
          category_id: newCategoryData.id,
          language: i18n.language!,
          name: newCategory.trim(),
          slug: slug
        });

      if (i18nError) {
        console.error('Category i18n creation error:', i18nError);
        // Try to clean up the created category
        await supabase.from('categories').delete().eq('id', newCategoryData.id);
        throw new Error(`Failed to create category translation: ${i18nError.message}`);
      }

      // Add to local state
      categories = [...categories, { id: newCategoryData.id, name: newCategory.trim(), slug }];
      selectedCategories = [...selectedCategories, newCategoryData.id];
      newCategory = '';
    } catch (error) {
      console.error('Error creating category:', error);
      errorMsg = error instanceof Error ? error.message : 'Failed to create category';
    }
  }

  // --- Save ---
  async function savePost() {
    loading = true;
    errorMsg = null;

    if (!i18n.title?.trim()) {
      errorMsg = 'Title is required.';
      loading = false;
      return;
    }
    if (!i18n.slug?.trim()) {
      errorMsg = 'Slug is required.';
      loading = false;
      return;
    }
    if (!i18n.language) {
      errorMsg = 'Language is required.';
      loading = false;
      return;
    }
    if (!post.status) {
      errorMsg = 'Status is required.';
      loading = false;
      return;
    }

    // Check if user is authenticated
    if (!user?.id) {
      errorMsg = 'You must be logged in to create a blog post.';
      loading = false;
      return;
    }

    console.log('User ID:', user.id);
    console.log('User email:', user.email);

    try {
      const blogInsert: TablesInsert<'blogs'> = {
        author_id: user.id,
        status: post.status!,
        featured: !!post.featured,
        default_language: i18n.language!,
        hero_image_url: post.hero_image_url || null
      };

      const { data: newPost, error: postError } = await supabase
        .from('blogs')
        .insert(blogInsert)
        .select('id')
        .single();

      if (postError) {
        console.error('Blog creation error:', postError);
        throw new Error(`Failed to create post: ${postError.message}`);
      }

      if (!newPost) {
        throw new Error('Failed to create post: No data returned');
      }

      const i18nInsert: TablesInsert<'blogs_i18n'> = {
        post_id: newPost.id,
        language: i18n.language!,
        title: i18n.title!.trim(),
        slug: i18n.slug!.trim(),
        content: i18n.content?.trim() || null,
        description: i18n.description?.trim() || null,
        translation_status:
          (i18n.translation_status as 'draft' | 'in_progress' | 'published') ?? 'draft',
        image_url: i18n.image_url || null,
        meta_title: i18n.meta_title?.trim() || null,
        meta_description: i18n.meta_description?.trim() || null
      };

      const { error: i18nError } = await supabase.from('blogs_i18n').insert(i18nInsert);
      if (i18nError) {
        await supabase.from('blogs').delete().eq('id', newPost.id);
        throw new Error(`Failed to create post content: ${i18nError.message}`);
      }

      // Save categories (with error handling)
      if (selectedCategories.length > 0) {
        try {
          const categoryInserts = selectedCategories.map(categoryId => ({
            post_id: newPost.id,
            category_id: categoryId
          }));
          
          const { error: categoryError } = await supabase
            .from('blog_categories')
            .insert(categoryInserts);
          
          if (categoryError) {
            console.error('Failed to save categories:', categoryError);
            // Don't throw error, just log it - blog post is still saved
          }
        } catch (error) {
          console.error('Error saving categories:', error);
        }
      }

      // Save tags (with error handling)
      if (selectedTags.length > 0) {
        try {
          const tagInserts = selectedTags.map(tagId => ({
            post_id: newPost.id,
            tag_id: tagId
          }));
          
          const { error: tagError } = await supabase
            .from('blog_tags')
            .insert(tagInserts);
          
          if (tagError) {
            console.error('Failed to save tags:', tagError);
            // Don't throw error, just log it - blog post is still saved
          }
        } catch (error) {
          console.error('Error saving tags:', error);
        }
      }

      // Clear draft from localStorage
      localStorage.removeItem('blog_draft');
      
      // Clear auto-save interval
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }

      goto('/blogs');
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-3xl mx-auto py-8">
  <Card>
    <CardHeader>
      <CardTitle>Create New Blog Post</CardTitle>
      <CardDescription>Write in Markdown. Preview safely before publishing.</CardDescription>
    </CardHeader>

    <CardContent class="grid gap-6">
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

        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onclick={openImageModal}
              class="cursor-pointer hover:scale-[0.98] transition-transform duration-150"
            >
              Upload Image
            </Button>
            <Switch id="preview" checked={showPreview} onCheckedChange={(v) => (showPreview = v)} />
            <Label for="preview" class="text-xs">Preview</Label>
          </div>
          
          <!-- Auto-save status -->
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            {#if autoSaveStatus === 'saving'}
              <div class="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              <span>Saving...</span>
            {:else if autoSaveStatus === 'saved'}
              <span class="text-green-600">Saved</span>
            {:else if autoSaveStatus === 'error'}
              <span class="text-red-600">Save failed</span>
            {:else if lastSaved}
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            {/if}
          </div>
        </div>

        <!-- Container with fixed min-height to prevent layout shift -->
        <div class="relative" style="min-height: 400px;">
          <!-- Keep both components mounted, just toggle visibility -->
          <MarkdownEditor
            bind:this={editorComponent}
            value={i18n.content || ''}
            onChange={(newValue) => {
              i18n.content = newValue;
            }}
            isVisible={!showPreview}
          />

          <!-- Preview container with matching min-height -->
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

      <!-- Categories Section -->
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label>Categories</Label>
          <div class="flex flex-wrap gap-2">
            {#each categories as category}
              <Badge
                variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                class="cursor-pointer hover:bg-primary/10"
                onclick={() => toggleCategory(category.id)}
              >
                {category.name}
              </Badge>
            {/each}
          </div>
          <div class="flex gap-2">
            <Input
              placeholder="Add new category"
              value={newCategory}
              oninput={(e) => (newCategory = e.currentTarget.value)}
              onkeydown={(e) => e.key === 'Enter' && createNewCategory()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onclick={createNewCategory}
              disabled={!newCategory.trim()}
              class="cursor-pointer hover:scale-[0.98] transition-transform duration-150 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Add
            </Button>
          </div>
        </div>

        <!-- Tags Section -->
        <div class="grid gap-2">
          <Label>Tags</Label>
          <div class="flex flex-wrap gap-2">
            {#each tags as tag}
              <Badge
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                class="cursor-pointer hover:bg-primary/10"
                onclick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </Badge>
            {/each}
          </div>
          <div class="flex gap-2">
            <Input
              placeholder="Add new tag"
              value={newTag}
              oninput={(e) => (newTag = e.currentTarget.value)}
              onkeydown={(e) => e.key === 'Enter' && createNewTag()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onclick={createNewTag}
              disabled={!newTag.trim()}
              class="cursor-pointer hover:scale-[0.98] transition-transform duration-150 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Add
            </Button>
          </div>
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
        <Button variant="outline" onclick={() => goto('/blogs')} disabled={loading} class="cursor-pointer hover:scale-[0.98] transition-transform duration-150 disabled:cursor-not-allowed disabled:hover:scale-100"> Cancel </Button>

        <Button
          onclick={savePost}
          disabled={loading ||
            !i18n.title?.trim() ||
            !i18n.slug?.trim() ||
            !i18n.language ||
            !post.status}
          class="cursor-pointer hover:scale-[0.98] transition-transform duration-150 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {#if loading}
            <div
              class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            ></div>
            Saving...
          {:else}
            Save Post
          {/if}
        </Button>
      </div>
    </CardFooter>
  </Card>

  <!-- Image Upload Modal -->
  <AssetUploadModal 
    bind:open={showImageModal}
    onUploadComplete={onImageUploadComplete}
    bucket="autoreels"
    folder="blogs"
    user={user}
  />
</div>