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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bishop_profile: {
        Row: {
          bio: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          photo_url: string | null
          schedule: Json
          title: string
          updated_at: string
          verse: string | null
          verse_reference: string | null
        }
        Insert: {
          bio?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          schedule?: Json
          title?: string
          updated_at?: string
          verse?: string | null
          verse_reference?: string | null
        }
        Update: {
          bio?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          schedule?: Json
          title?: string
          updated_at?: string
          verse?: string | null
          verse_reference?: string | null
        }
        Relationships: []
      }
      church_history: {
        Row: {
          full_history: string | null
          id: string
          intro: string | null
          updated_at: string
        }
        Insert: {
          full_history?: string | null
          id?: string
          intro?: string | null
          updated_at?: string
        }
        Update: {
          full_history?: string | null
          id?: string
          intro?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ministries: {
        Row: {
          cover_image_url: string | null
          id: string
          leaders: Json
          mission: string | null
          name: string
          support_info: string | null
          tagline: string | null
          updated_at: string
          vision: string | null
        }
        Insert: {
          cover_image_url?: string | null
          id: string
          leaders?: Json
          mission?: string | null
          name: string
          support_info?: string | null
          tagline?: string | null
          updated_at?: string
          vision?: string | null
        }
        Update: {
          cover_image_url?: string | null
          id?: string
          leaders?: Json
          mission?: string | null
          name?: string
          support_info?: string | null
          tagline?: string | null
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      ministry_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          id: string
          ministry_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          ministry_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          ministry_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ministry_events_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
      ministry_gallery: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          ministry_id: string
          sort_order: number
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          ministry_id: string
          sort_order?: number
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          ministry_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "ministry_gallery_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
      order_of_service: {
        Row: {
          id: string
          items: Json
          service_name: string
          updated_at: string
        }
        Insert: {
          id?: string
          items?: Json
          service_name?: string
          updated_at?: string
        }
        Update: {
          id?: string
          items?: Json
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      past_pastors: {
        Row: {
          accomplishments: string[]
          created_at: string
          id: string
          name: string
          sort_order: number
          title: string
          updated_at: string
          years: string
        }
        Insert: {
          accomplishments?: string[]
          created_at?: string
          id?: string
          name: string
          sort_order?: number
          title: string
          updated_at?: string
          years: string
        }
        Update: {
          accomplishments?: string[]
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
          title?: string
          updated_at?: string
          years?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      sermons: {
        Row: {
          created_at: string
          description: string | null
          id: string
          preached_on: string | null
          published: boolean
          scripture: string | null
          speaker: string | null
          tags: string[]
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          preached_on?: string | null
          published?: boolean
          scripture?: string | null
          speaker?: string | null
          tags?: string[]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          preached_on?: string | null
          published?: boolean
          scripture?: string | null
          speaker?: string | null
          tags?: string[]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          card_donation_url: string | null
          contact_address: string | null
          contact_email: string | null
          contact_phone: string | null
          facebook_page_url: string | null
          id: string
          mpesa_account: string | null
          mpesa_paybill: string | null
          updated_at: string
          youtube_channel_id: string | null
          youtube_live_video_id: string | null
        }
        Insert: {
          card_donation_url?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          facebook_page_url?: string | null
          id?: string
          mpesa_account?: string | null
          mpesa_paybill?: string | null
          updated_at?: string
          youtube_channel_id?: string | null
          youtube_live_video_id?: string | null
        }
        Update: {
          card_donation_url?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          facebook_page_url?: string | null
          id?: string
          mpesa_account?: string | null
          mpesa_paybill?: string | null
          updated_at?: string
          youtube_channel_id?: string | null
          youtube_live_video_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "bishop" | "it_admin" | "editor"
    }
    CompositeTypes: {
      [_ in never]: never
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
      app_role: ["bishop", "it_admin", "editor"],
    },
  },
} as const
