export interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Issuer {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name: string;
  issuer_id: number;
  logo_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  issuer?: Issuer;
}

export interface Questionnaire {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionOption {
  id: number;
  question_id: number;
  text: string;
  value: string;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: number;
  questionnaire_id: number;
  text: string;
  type: 'multiple_choice' | 'yes_no' | 'scale' | 'text_input';
  section: 'Environmental' | 'Social' | 'Governance';
  order?: number;
  created_at: string;
  updated_at: string;
  options: QuestionOption[];
}

export interface Response {
  id: number;
  company_id: number;
  question_id: number;
  value: string;
  score?: number;
  created_at: string;
  updated_at: string;
}

export interface ScoringConfig {
  id: number;
  questionnaire_id: number;
  section: 'Environmental' | 'Social' | 'Governance';
  aggregation_method: 'sum' | 'average' | 'weighted_average';
  weight: number;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: number;
  company_id: number;
  questionnaire_id: number;
  overall_score?: number;
  section_scores?: {
    Environmental?: number;
    Social?: number;
    Governance?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface BulkUploadResponse {
  success_count: number;
  failure_count: number;
  errors: any[];
}