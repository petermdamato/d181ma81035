export type AISearchCriteria = {
  topic?: string | null;
  subject_population?: string | null;
  years_dates?: string | null;
  ownership?: string | null;
  data_type?: string | null;
  data_use?: string | null;
  geography?: string | null;
  other_details?: string | null;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ChatResponse = {
  criteria: AISearchCriteria;
  assistantMessage: string;
  showResultsButton: boolean;
};

export type CompanySearchResult = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  subcategory: string | null;
  matchReason?: string;
};

export type AISearchResultsResponse = {
  assistantSummary?: string;
  results: CompanySearchResult[];
};
