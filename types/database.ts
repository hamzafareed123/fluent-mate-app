export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PrimaryGoal =
  | 'everyday_conversation'
  | 'job_interviews'
  | 'professional'
  | 'studying_abroad'
  | 'presentations'
  | 'general_fluency';

export type SelfReportedLevel =
  | 'beginner'
  | 'elementary'
  | 'intermediate'
  | 'upper_intermediate'
  | 'advanced';

export type CorrectionPreference = 'gentle' | 'direct';

export type ActivityType =
  | 'speaking_conversation'
  | 'vocabulary_review'
  | 'grammar_correction'
  | 'sentence_building'
  | 'listening_comprehension'
  | 'pronunciation_practice'
  | 'role_play'
  | 'storytelling'
  | 'interview_simulation'
  | 'daily_reflection';

export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Relationships: [];
        Row: {
          id: string;
          display_name: string | null;
          primary_goal: PrimaryGoal | null;
          self_reported_level: SelfReportedLevel | null;
          daily_goal_minutes: number | null;
          correction_preference: CorrectionPreference | null;
          preferred_accent: string | null;
          onboarding_completed: boolean;
          total_xp: number;
          current_streak: number;
          longest_streak: number;
          estimated_cefr_level: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          primary_goal?: PrimaryGoal | null;
          self_reported_level?: SelfReportedLevel | null;
          daily_goal_minutes?: number | null;
          correction_preference?: CorrectionPreference | null;
          preferred_accent?: string | null;
          onboarding_completed?: boolean;
          total_xp?: number;
          current_streak?: number;
          longest_streak?: number;
          estimated_cefr_level?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      assessments: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          assessment_type: string;
          estimated_cefr_level: string;
          skill_scores: Json;
          strengths: string[] | null;
          weaknesses: string[] | null;
          recommendations: string | null;
          pronunciation_assessed: boolean;
          assessment_version: string;
          raw_report: Json | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['assessments']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['assessments']['Insert']>;
      };
      learning_plans: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          plan_date: string;
          plan_data: Json;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['learning_plans']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['learning_plans']['Insert']>;
      };
      milestones: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          learning_plan_id: string;
          title: string;
          description: string | null;
          activity_type: ActivityType;
          difficulty: string;
          estimated_minutes: number;
          completion_criteria: string | null;
          xp_reward: number;
          status: MilestoneStatus;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['milestones']['Row'], 'id' | 'created_at' | 'description' | 'completion_criteria' | 'completed_at'> & {
          id?: string;
          created_at?: string;
          description?: string | null;
          completion_criteria?: string | null;
          completed_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['milestones']['Insert']>;
      };
      conversation_sessions: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          scenario: string | null;
          session_summary: string | null;
          duration_seconds: number | null;
          started_at: string;
          ended_at: string | null;
        };
        Insert: Omit<
          Database['public']['Tables']['conversation_sessions']['Row'],
          'id' | 'started_at' | 'session_summary' | 'duration_seconds' | 'ended_at'
        > & { id?: string; started_at?: string; session_summary?: string | null; duration_seconds?: number | null; ended_at?: string | null };
        Update: Partial<Database['public']['Tables']['conversation_sessions']['Insert']>;
      };
      conversation_messages: {
        Relationships: [];
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          role: 'user' | 'assistant' | 'system';
          message_text: string;
          message_metadata: Json | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['conversation_messages']['Row'], 'id' | 'created_at' | 'message_metadata'> & {
          id?: string;
          created_at?: string;
          message_metadata?: Json | null;
        };
        Update: Partial<Database['public']['Tables']['conversation_messages']['Insert']>;
      };
      mistakes: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          original_text: string;
          corrected_text: string;
          explanation: string | null;
          error_category: string | null;
          occurrence_count: number;
          last_seen_at: string;
          mastery_status: string;
        };
        Insert: Omit<Database['public']['Tables']['mistakes']['Row'], 'id' | 'occurrence_count' | 'last_seen_at'> & {
          id?: string;
          occurrence_count?: number;
          last_seen_at?: string;
        };
        Update: Partial<Database['public']['Tables']['mistakes']['Insert']>;
      };
      vocabulary_items: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          word: string;
          definition: string | null;
          example_sentence: string | null;
          review_interval_days: number;
          next_review_at: string | null;
          successful_reviews: number;
          mastery_status: string;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['vocabulary_items']['Row'],
          'id' | 'created_at' | 'review_interval_days' | 'successful_reviews'
        > & {
          id?: string;
          review_interval_days?: number;
          successful_reviews?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['vocabulary_items']['Insert']>;
      };
      daily_stats: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          local_date: string;
          xp_earned: number;
          speaking_minutes: number;
          milestones_completed: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['daily_stats']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['daily_stats']['Insert']>;
      };
      milestone_completions: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          milestone_id: string;
          idempotency_key: string;
          xp_awarded: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['milestone_completions']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['milestone_completions']['Insert']>;
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
  };
};
