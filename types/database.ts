export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          display_name: string | null;
          industry: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      data_delivery_methods: {
        Row: {
          id: string;
          name: string;
        };
        Insert: Omit<Database["public"]["Tables"]["data_delivery_methods"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["data_delivery_methods"]["Insert"]>;
      };
      data_attributes: {
        Row: {
          id: string;
          name: string;
          public: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["data_attributes"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["data_attributes"]["Insert"]>;
      };
      companies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          website_url: string | null;
          category: string | null;
          subcategory: string | null;
          delivery_method_ids: string[];
          data_attribute_ids: string[];
          claimed: boolean;
          claimed_contact: string | null;
          claimed_by_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["companies"]["Row"], "id" | "created_at" | "updated_at" | "slug" | "delivery_method_ids" | "data_attribute_ids"> & {
          id?: string;
          slug?: string; // optional: generated from name + category + subcategory if omitted
          delivery_method_ids?: string[];
          data_attribute_ids?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>;
      };
      company_claim_tokens: {
        Row: {
          id: string;
          company_id: string;
          email: string;
          token: string;
          expires_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["company_claim_tokens"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_claim_tokens"]["Insert"]>;
      };
      ai_search_sessions: {
        Row: {
          id: string;
          created_at: string;
          topic: string | null;
          subject_population: string | null;
          years_dates: string | null;
          ownership: string | null;
          data_type: string | null;
          data_use: string | null;
          geography: string | null;
          other_details: string | null;
          raw_messages: unknown;
        };
        Insert: Omit<Database["public"]["Tables"]["ai_search_sessions"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_search_sessions"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          rating: number | null;
          title: string;
          body: string | null;
          ease_of_access_rating: number | null;
          sales_team_rating: number | null;
          data_coverage_rating: number | null;
          value_rating: number | null;
          found_when: string | null;
          result: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
    };
  };
}

export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type DataDeliveryMethod = Database["public"]["Tables"]["data_delivery_methods"]["Row"];
export type DataAttribute = Database["public"]["Tables"]["data_attributes"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type ReviewWithCompany = Review & { companies: Pick<Company, "name" | "slug"> | null };
export type ReviewWithProfile = ReviewWithCompany & { profiles: Pick<Profile, "display_name" | "full_name"> | null };
