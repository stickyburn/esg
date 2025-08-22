'use client';

import { useState } from 'react';
import { useQuestions, useBulkSubmitResponses } from '@/hooks/useApi';
import { Question, Response } from '@/types';
import { Button } from '@/components/ui/button';

interface EnvironmentalAssessmentProps {
  selectedCompanyId: number | null;
}

export default function EnvironmentalAssessmentComponent({ selectedCompanyId }: EnvironmentalAssessmentProps) {
  const { data: questions, isLoading, isError } = useQuestions('Environmental');
  const bulkSubmitMutation = useBulkSubmitResponses();
  const [formData, setFormData] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (questionId: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedCompanyId || !questions) {
      alert('Please select a company and ensure questions are loaded.');
      return;
    }

    const responses: Omit<Response, 'id' | 'score' | 'created_at' | 'updated_at'>[] = questions.map((q) => ({
      company_id: selectedCompanyId,
      question_id: q.id,
      value: formData[q.id] || '',
    }));

    bulkSubmitMutation.mutate({ responses }, {
      onSuccess: () => {
        setIsSubmitted(true);
        setFormData({}); // Clear form
      },
      onError: (error) => {
        console.error('Submission failed:', error);
        alert(`Failed to submit responses: ${error.message}`);
      },
    });
  };

  if (isLoading) {
    return <div>Loading Environmental questions...</div>;
  }

  if (isError) {
    return <div>Error loading Environmental questions.</div>;
  }

  if (isSubmitted) {
    return (
      <div className="p-4 border border-green-300 bg-green-100 rounded-md">
        <h3 className="text-lg font-medium text-green-800">Assessment Submitted Successfully!</h3>
        <p className="text-green-700">Thank you for completing the Environmental assessment.</p>
        <Button onClick={() => setIsSubmitted(false)} className="mt-4">
          Submit Another Response
        </Button>
      </div>
    );
  }

  if (!selectedCompanyId) {
    return <p className="text-gray-500">Please select a company to start the assessment.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Environmental Assessment</h2>
      {questions?.map((question: Question) => (
        <div key={question.id} className="p-4 border border-gray-200 rounded-md">
          <label htmlFor={`question-${question.id}`} className="block text-sm font-medium text-gray-700">
            {question.text}
          </label>
          {question.type === 'multiple_choice' && (
            <select
              id={`question-${question.id}`}
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select an option</option>
              {question.options.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          )}
          {question.type === 'yes_no' && (
            <div className="mt-2 space-x-4">
              {question.options.map((option) => (
                <label key={option.id} className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.value}
                    checked={formData[question.id] === option.value}
                    onChange={() => handleInputChange(question.id, option.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.text}</span>
                </label>
              ))}
            </div>
          )}
          {question.type === 'scale' && (
            <div className="mt-2 space-x-2">
              {question.options.map((option) => (
                <label key={option.id} className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.value}
                    checked={formData[question.id] === option.value}
                    onChange={() => handleInputChange(question.id, option.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.text}</span>
                </label>
              ))}
            </div>
          )}
          {question.type === 'text_input' && (
            <input
              type="text"
              id={`question-${question.id}`}
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          )}
        </div>
      ))}
      <Button type="submit" disabled={bulkSubmitMutation.isPending}>
        {bulkSubmitMutation.isPending ? 'Submitting...' : 'Submit Assessment'}
      </Button>
    </form>
  );
}
