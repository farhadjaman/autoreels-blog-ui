export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.1 (d3f7cba)"
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          category_id: number
          post_id: string
        }
        Insert: {
          category_id: number
          post_id: string
        }
        Update: {
          category_id?: number
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          post_id: string
          tag_id: number
        }
        Insert: {
          post_id: string
          tag_id: number
        }
        Update: {
          post_id?: string
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          author_name: string | null
          created_at: string
          default_language: string
          featured: boolean
          hero_image_url: string | null
          id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          author_name?: string | null
          created_at?: string
          default_language?: string
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          author_name?: string | null
          created_at?: string
          default_language?: string
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_default_language_fkey"
            columns: ["default_language"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      blogs_i18n: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          image_url: string | null
          language: string
          meta_description: string | null
          meta_title: string | null
          post_id: string
          slug: string
          title: string
          translation_status: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          image_url?: string | null
          language: string
          meta_description?: string | null
          meta_title?: string | null
          post_id: string
          slug: string
          title: string
          translation_status?: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          image_url?: string | null
          language?: string
          meta_description?: string | null
          meta_title?: string | null
          post_id?: string
          slug?: string
          title?: string
          translation_status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_i18n_language_fkey"
            columns: ["language"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "posts_i18n_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: number
        }
        Insert: {
          id?: number
        }
        Update: {
          id?: number
        }
        Relationships: []
      }
      categories_i18n: {
        Row: {
          category_id: number
          language: string
          name: string
          slug: string
        }
        Insert: {
          category_id: number
          language: string
          name: string
          slug: string
        }
        Update: {
          category_id?: number
          language?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_i18n_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_i18n_language_fkey"
            columns: ["language"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      demo: {
        Row: {
          config: Json | null
          content_type: string | null
          created_at: string | null
          id: string
          language: string | null
          original_height: number | null
          original_width: number | null
          path: string | null
          skeleton: Json | null
          title: string | null
          transcription: string | null
          user_id: string | null
          video_duration: number
          video_key: string | null
          words: Json[] | null
        }
        Insert: {
          config?: Json | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          language?: string | null
          original_height?: number | null
          original_width?: number | null
          path?: string | null
          skeleton?: Json | null
          title?: string | null
          transcription?: string | null
          user_id?: string | null
          video_duration: number
          video_key?: string | null
          words?: Json[] | null
        }
        Update: {
          config?: Json | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          language?: string | null
          original_height?: number | null
          original_width?: number | null
          path?: string | null
          skeleton?: Json | null
          title?: string | null
          transcription?: string | null
          user_id?: string | null
          video_duration?: number
          video_key?: string | null
          words?: Json[] | null
        }
        Relationships: []
      }
      feature_definitions: {
        Row: {
          created_at: string | null
          default_value: Json | null
          description: string | null
          feature_type: Database["public"]["Enums"]["feature_type_enum"]
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_value?: Json | null
          description?: string | null
          feature_type: Database["public"]["Enums"]["feature_type_enum"]
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_value?: Json | null
          description?: string | null
          feature_type?: Database["public"]["Enums"]["feature_type_enum"]
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feature_usage_logs: {
        Row: {
          feature_id: string | null
          id: string
          recorded_at: string | null
          subscription_id: string | null
          usage_data: Json | null
          user_id: string | null
        }
        Insert: {
          feature_id?: string | null
          id?: string
          recorded_at?: string | null
          subscription_id?: string | null
          usage_data?: Json | null
          user_id?: string | null
        }
        Update: {
          feature_id?: string | null
          id?: string
          recorded_at?: string | null
          subscription_id?: string | null
          usage_data?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_usage_logs_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_usage_logs_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["user_role_type"]
          status: string
          team_id: string | null
          token: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["user_role_type"]
          status?: string
          team_id?: string | null
          token?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["user_role_type"]
          status?: string
          team_id?: string | null
          token?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          code: string
          dir: string
          name: string
        }
        Insert: {
          code: string
          dir?: string
          name: string
        }
        Update: {
          code?: string
          dir?: string
          name?: string
        }
        Relationships: []
      }
      payment_gateway_products: {
        Row: {
          created_at: string | null
          gateway_id: string | null
          gateway_lifetime_price_id: string | null
          gateway_price_id: string | null
          gateway_product_id: string | null
          gateway_yearly_price_id: string | null
          id: string
          is_active: boolean | null
          plan_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          gateway_id?: string | null
          gateway_lifetime_price_id?: string | null
          gateway_price_id?: string | null
          gateway_product_id?: string | null
          gateway_yearly_price_id?: string | null
          id?: string
          is_active?: boolean | null
          plan_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          gateway_id?: string | null
          gateway_lifetime_price_id?: string | null
          gateway_price_id?: string | null
          gateway_product_id?: string | null
          gateway_yearly_price_id?: string | null
          id?: string
          is_active?: boolean | null
          plan_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_gateway_products_gateway_id_fkey"
            columns: ["gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_gateway_products_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateways: {
        Row: {
          config: Json | null
          created_at: string | null
          display_name: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          gateway: string
          payment_id: string
          status: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["payment_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          gateway: string
          payment_id?: string
          status: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["payment_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          gateway?: string
          payment_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          type?: Database["public"]["Enums"]["payment_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_gateway"
            columns: ["gateway"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_features: {
        Row: {
          created_at: string | null
          feature_id: string | null
          id: string
          plan_id: string | null
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          feature_id?: string | null
          id?: string
          plan_id?: string | null
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          feature_id?: string | null
          id?: string
          plan_id?: string | null
          updated_at?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "plan_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_features_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          billing_interval: Database["public"]["Enums"]["billing_interval_type"]
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          lifetime_price: number | null
          name: string
          price: number | null
          updated_at: string | null
          yearly_price: number | null
        }
        Insert: {
          billing_interval: Database["public"]["Enums"]["billing_interval_type"]
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          lifetime_price?: number | null
          name: string
          price?: number | null
          updated_at?: string | null
          yearly_price?: number | null
        }
        Update: {
          billing_interval?: Database["public"]["Enums"]["billing_interval_type"]
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          lifetime_price?: number | null
          name?: string
          price?: number | null
          updated_at?: string | null
          yearly_price?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          active: boolean | null
          config: Json | null
          content_type: string | null
          created_at: string | null
          description: string | null
          download_url: string | null
          id: string
          language: string | null
          original_height: number | null
          original_width: number | null
          path: string | null
          skeleton: Json | null
          status: Database["public"]["Enums"]["project_status_type"] | null
          team_id: string | null
          title: string | null
          transcription: string | null
          user_id: string | null
          video_duration: number
          video_key: string | null
          words: Json[] | null
        }
        Insert: {
          active?: boolean | null
          config?: Json | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          download_url?: string | null
          id?: string
          language?: string | null
          original_height?: number | null
          original_width?: number | null
          path?: string | null
          skeleton?: Json | null
          status?: Database["public"]["Enums"]["project_status_type"] | null
          team_id?: string | null
          title?: string | null
          transcription?: string | null
          user_id?: string | null
          video_duration: number
          video_key?: string | null
          words?: Json[] | null
        }
        Update: {
          active?: boolean | null
          config?: Json | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          download_url?: string | null
          id?: string
          language?: string | null
          original_height?: number | null
          original_width?: number | null
          path?: string | null
          skeleton?: Json | null
          status?: Database["public"]["Enums"]["project_status_type"] | null
          team_id?: string | null
          title?: string | null
          transcription?: string | null
          user_id?: string | null
          video_duration?: number
          video_key?: string | null
          words?: Json[] | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          payment_gateway_id: string
          payment_gateway_subscription_id: string | null
          plan_id: string | null
          status: Database["public"]["Enums"]["subscription_status_type"]
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_gateway_id: string
          payment_gateway_subscription_id?: string | null
          plan_id?: string | null
          status: Database["public"]["Enums"]["subscription_status_type"]
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_gateway_id?: string
          payment_gateway_subscription_id?: string | null
          plan_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status_type"]
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: number
        }
        Insert: {
          id?: number
        }
        Update: {
          id?: number
        }
        Relationships: []
      }
      tags_i18n: {
        Row: {
          language: string
          name: string
          slug: string
          tag_id: number
        }
        Insert: {
          language: string
          name: string
          slug: string
          tag_id: number
        }
        Update: {
          language?: string
          name?: string
          slug?: string
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tags_i18n_language_fkey"
            columns: ["language"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "tags_i18n_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      team_features: {
        Row: {
          created_at: string | null
          features: Json
          id: string
          last_reset: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features?: Json
          id?: string
          last_reset?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: Json
          id?: string
          last_reset?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_features_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string | null
          id: string
          invited_by: string | null
          is_active: boolean | null
          joined_at: string | null
          role: Database["public"]["Enums"]["user_role_type"]
          team_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          role: Database["public"]["Enums"]["user_role_type"]
          team_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["user_role_type"]
          team_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          billing_address: string | null
          billing_email: string | null
          created_at: string | null
          id: string
          is_personal: boolean | null
          name: string
          owner_id: string | null
          path: unknown | null
          updated_at: string | null
          workspace_slug: string | null
        }
        Insert: {
          billing_address?: string | null
          billing_email?: string | null
          created_at?: string | null
          id?: string
          is_personal?: boolean | null
          name: string
          owner_id?: string | null
          path?: unknown | null
          updated_at?: string | null
          workspace_slug?: string | null
        }
        Update: {
          billing_address?: string | null
          billing_email?: string | null
          created_at?: string | null
          id?: string
          is_personal?: boolean | null
          name?: string
          owner_id?: string | null
          path?: unknown | null
          updated_at?: string | null
          workspace_slug?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          language: string
          project_id: string
          sentences: Json | null
          skeleton: Json
          transcription: string | null
          updated_at: string
          words: Json
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          language: string
          project_id: string
          sentences?: Json | null
          skeleton: Json
          transcription?: string | null
          updated_at?: string
          words: Json
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          language?: string
          project_id?: string
          sentences?: Json | null
          skeleton?: Json
          transcription?: string | null
          updated_at?: string
          words?: Json
        }
        Relationships: [
          {
            foreignKeyName: "translations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_gateway_customers: {
        Row: {
          created_at: string | null
          customer_id: string
          gateway_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          gateway_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          gateway_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_gateway_customers_gateway_id_fkey"
            columns: ["gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          email_verified: boolean | null
          first_name: string | null
          id: string
          last_login: string | null
          last_name: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _ltree_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      _ltree_gist_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      lca: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      lquery_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      lquery_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      lquery_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      lquery_send: {
        Args: { "": unknown }
        Returns: string
      }
      ltree_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_gist_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_gist_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      ltree_gist_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_send: {
        Args: { "": unknown }
        Returns: string
      }
      ltree2text: {
        Args: { "": unknown }
        Returns: string
      }
      ltxtq_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltxtq_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltxtq_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltxtq_send: {
        Args: { "": unknown }
        Returns: string
      }
      nlevel: {
        Args: { "": unknown }
        Returns: number
      }
      text2ltree: {
        Args: { "": string }
        Returns: unknown
      }
    }
    Enums: {
      billing_interval_type: "monthly" | "yearly" | "lifetime"
      feature_type_enum: "numeric" | "boolean" | "string" | "object"
      payment_status: "pending" | "success" | "failed"
      payment_type: "subscription" | "payment"
      project_status_type:
        | "draft"
        | "processing"
        | "published"
        | "archived"
        | "expired"
      subscription_status_type: "active" | "past_due" | "canceled" | "trialing"
      user_role_type: "owner" | "admin" | "member" | "guest"
    }
    CompositeTypes: {
      word: {
        id: string | null
        text: string | null
        type: string | null
        emoji: string | null
        important: boolean | null
        start_time: number | null
        end_time: number | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      billing_interval_type: ["monthly", "yearly", "lifetime"],
      feature_type_enum: ["numeric", "boolean", "string", "object"],
      payment_status: ["pending", "success", "failed"],
      payment_type: ["subscription", "payment"],
      project_status_type: [
        "draft",
        "processing",
        "published",
        "archived",
        "expired",
      ],
      subscription_status_type: ["active", "past_due", "canceled", "trialing"],
      user_role_type: ["owner", "admin", "member", "guest"],
    },
  },
} as const
