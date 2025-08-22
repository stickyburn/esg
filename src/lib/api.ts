import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

console.log("NEXT_PUBLIC_API_URL from env:", process.env.NEXT_PUBLIC_API_URL);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
console.log("API_BASE_URL being used:", API_BASE_URL);

// Generic API request function
const apiRequest = async <T,>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "An unknown error occurred" }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// --- Report APIs ---

export const getReports = (): Promise<any[]> => {
  return apiRequest("/reports");
};

export const getReport = (id: number): Promise<any> => {
  return apiRequest(`/reports/${id}`);
};

export const generateReport = (data: { company_id: number; questionnaire_id: number }): Promise<any> => {
  return apiRequest("/reports/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const exportReport = (id: number): Promise<Blob> => {
  return axios({
    url: `${API_BASE_URL}/reports/${id}/export`,
    method: "GET",
    responseType: "blob", // Important for file downloads
  }).then((response) => response.data);
};

export const exportHistoricalReports = (filters?: { company_id?: number; questionnaire_id?: number }): Promise<Blob> => {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }
  const queryString = queryParams.toString();
  const endpoint = `/reports/export/historical${queryString ? `?${queryString}` : ""}`;

  return axios({
    url: `${API_BASE_URL}${endpoint}`,
    method: "GET",
    responseType: "blob",
  }).then((response) => response.data);
};

// --- Company APIs ---

export const getCompanies = (): Promise<any[]> => {
  return apiRequest("/companies");
};

export const getCompany = (id: number): Promise<any> => {
  return apiRequest(`/companies/${id}`);
};

// --- Questionnaire APIs ---

export const getQuestionnaires = (): Promise<any[]> => {
  return apiRequest("/questionnaires");
};

export const getQuestionnaire = (id: number): Promise<any> => {
  return apiRequest(`/questionnaires/${id}`);
};

// --- Response APIs ---

export const getResponses = (filters?: { company_id?: number; questionnaire_id?: number }): Promise<any[]> => {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }
  const queryString = queryParams.toString();
  return apiRequest(`/responses${queryString ? `?${queryString}` : ""}`);
};

export const getResponse = (id: number): Promise<any> => {
  return apiRequest(`/responses/${id}`);
};

export const upsertResponse = (data: { company_id: number; question_id: number; value: string }): Promise<any> => {
  return apiRequest("/responses", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Custom hooks for TanStack Query
export const useReports = () => {
  console.log("useReports hook called");
  return useQuery<any[], Error>({
    queryKey: ["reports"],
    queryFn: async () => {
      console.log("Fetching reports from API");
      const result = await getReports();
      console.log("Reports fetched:", result);
      return result;
    },
  });
};

export const useReport = (id: number | null) => {
  return useQuery<any, Error>({
    queryKey: ["report", id],
    queryFn: () => getReport(id!),
    enabled: !!id, // Only run query if id is not null
  });
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { company_id: number; questionnaire_id: number }>({
    mutationFn: generateReport,
    onSuccess: () => {
      // Invalidate and refetch reports query to update the list
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

export const useExportReport = () => {
  return useMutation<Blob, Error, number>({
    mutationFn: exportReport,
    onSuccess: (data, variables) => {
      // Create a blob URL and trigger a download
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ESG_Report_${variables}.xlsx`); // Set filename
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};

export const useResponses = (filters?: { company_id?: number; questionnaire_id?: number }) => {
  return useQuery<any[], Error>({
    queryKey: ["responses", filters],
    queryFn: () => getResponses(filters),
    enabled: !!filters, // Only run if filters are provided
  });
};

export const useUpsertResponse = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { company_id: number; question_id: number; value: string }>({
    mutationFn: upsertResponse,
    onSuccess: (data, variables) => {
      // Invalidate and refetch responses query
      queryClient.invalidateQueries({ queryKey: ["responses"] });
      // Potentially invalidate reports if a response update affects scores
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};