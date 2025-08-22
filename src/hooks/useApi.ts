import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Company, Question, Response, BulkUploadResponse } from '../types';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic GET hook
export function useApiGet<T>(
  queryKey: any[],
  url: string,
  options?: { enabled?: boolean; refetchOnWindowFocus?: boolean }
) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<T>(url);
      return data;
    },
    ...options,
  });
}

// Generic POST hook
export function useApiPost<T, V>(
  url: string,
  mutationKey?: any[]
) {
  const queryClient = useQueryClient();
  return useMutation<T, Error, V>({
    mutationKey,
    mutationFn: async (variables: V) => {
      const { data } = await apiClient.post<T>(url, variables);
      return data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries on successful post
      // This is a simple example; you might want to be more specific
      queryClient.invalidateQueries();
    },
  });
}

// Generic PUT hook
export function useApiPut<T, V>(
  url: string,
  id: number | string,
  mutationKey?: any[]
) {
  const queryClient = useQueryClient();
  return useMutation<T, Error, V>({
    mutationKey,
    mutationFn: async (variables: V) => {
      const { data } = await apiClient.put<T>(`${url}/${id}`, variables);
      return data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries();
    },
  });
}

// Generic DELETE hook
export function useApiDelete(
  url: string,
  mutationKey?: any[]
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey,
    mutationFn: async (id: number | string) => {
      await apiClient.delete(`${url}/${id}`);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries();
    },
  });
}

// Specific hooks for each entity can be built using the generic ones
// Example for Issuers
export const useIssuers = () => useApiGet<Issuer[]>('issuers', '/issuers');
export const useCreateIssuer = () => useApiPost<Issuer, IssuerCreate>('/issuers');
export const useUpdateIssuer = (id: number) => useApiPut<Issuer, IssuerBase>('/issuers', id);
export const useDeleteIssuer = () => useApiDelete('/issuers');

// Hooks for Companies
export const useCompanies = () => useApiGet<Company[]>('companies', '/companies');

// Hooks for Questions, can be filtered by section
export const useQuestions = (section?: string) => {
  const url = section ? `/questions?section=${section}` : '/questions';
  return useApiGet<Question[]>(['questions', section], url);
};

// Hook for submitting bulk responses
export const useBulkSubmitResponses = () => {
  const queryClient = useQueryClient();
  return useMutation<BulkUploadResponse, Error, { responses: Omit<Response, 'id' | 'score' | 'created_at' | 'updated_at'>[] }>({
    mutationFn: async (variables) => {
      const { data } = await apiClient.post<BulkUploadResponse>('/responses/bulk', variables);
      return data;
    },
    onSuccess: () => {
      // Invalidate queries for responses and possibly reports after a successful submission
      queryClient.invalidateQueries({ queryKey: ['responses'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};