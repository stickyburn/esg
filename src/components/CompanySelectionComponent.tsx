'use client';

import { useCompanies } from '@/hooks/useApi';
import { Company } from '@/types';

interface CompanySelectionProps {
  onCompanySelect: (companyId: number | null) => void;
  selectedCompanyId: number | null;
}

export default function CompanySelectionComponent({ onCompanySelect, selectedCompanyId }: CompanySelectionProps) {
  const { data: companies, isLoading, isError } = useCompanies();

  if (isLoading) {
    return <div>Loading companies...</div>;
  }

  if (isError) {
    return <div>Error loading companies.</div>;
  }

  return (
    <div className="mb-4">
      <label htmlFor="company-select" className="block text-sm font-medium text-gray-700">
        Select a Company
      </label>
      <select
        id="company-select"
        name="company"
        value={selectedCompanyId ?? ''}
        onChange={(e) => onCompanySelect(e.target.value ? parseInt(e.target.value, 10) : null)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="">--Please choose a company--</option>
        {companies?.map((company: Company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </div>
  );
}