// Advanced Scoring Engine

export interface Question {
  id: number;
  text: string;
  type: 'boolean' | 'multiple_choice' | 'numeric_range' | 'custom_formula';
  options?: string[];
  weight: number;
  scoringRules?: any;
}

export interface QuestionResponse {
  questionId: number;
  value: any;
}

export interface Section {
  id: number;
  name: string;
  scoringMethod: 'weighted_average' | 'sum' | 'custom_formula';
  formula?: string;
  weight?: number;
  questions: Question[];
}

export interface Assessment {
  id: number;
  issuerId: number;
  sections: Section[];
  responses: QuestionResponse[];
  weights?: Record<string, number>;
}

export interface ScoreBreakdown {
  questionId: number;
  questionText: string;
  response: any;
  score: number;
  maxScore: number;
  explanation: string;
}

export interface SectionScoreBreakdown {
  sectionId: number;
  sectionName: string;
  score: number;
  maxScore: number;
  percentage: number;
  questions: ScoreBreakdown[];
}

export interface OverallScoreBreakdown {
  overallScore: number;
  maxOverallScore: number;
  percentage: number;
  sections: SectionScoreBreakdown[];
}

class ScoringEngine {
  /**
   * Calculate the score for a single question based on the response
   */
  calculateQuestionScore(question: Question, response: any): number {
    switch (question.type) {
      case 'boolean':
        return this.calculateBooleanScore(question, response);
      case 'multiple_choice':
        return this.calculateMultipleChoiceScore(question, response);
      case 'numeric_range':
        return this.calculateNumericRangeScore(question, response);
      case 'custom_formula':
        return this.calculateCustomFormulaScore(question, response);
      default:
        return 0;
    }
  }

  /**
   * Calculate score for boolean (Yes/No) questions
   */
  private calculateBooleanScore(question: Question, response: boolean): number {
    // Default: Yes = positive (1), No = negative (0)
    const polarity = question.scoringRules?.polarity || 'positive';
    
    if (polarity === 'positive') {
      return response ? 1 : 0;
    } else {
      return response ? 0 : 1;
    }
  }

  /**
   * Calculate score for multiple choice questions
   */
  private calculateMultipleChoiceScore(question: Question, response: string): number {
    if (!question.options || !question.scoringRules?.weights) {
      return 0;
    }

    const weights = question.scoringRules.weights as Record<string, number>;
    return weights[response] || 0;
  }

  /**
   * Calculate score for numeric range questions
   */
  private calculateNumericRangeScore(question: Question, response: number): number {
    const { min = 0, max = 10, scaling = 'linear' } = question.scoringRules || {};
    
    if (response < min || response > max) {
      return 0;
    }

    if (scaling === 'linear') {
      return (response - min) / (max - min);
    } else if (scaling === 'logarithmic') {
      return Math.log(response - min + 1) / Math.log(max - min + 1);
    }
    
    return 0;
  }

  /**
   * Calculate score for custom formula questions
   */
  private calculateCustomFormulaScore(question: Question, response: any): number {
    // This is a simplified implementation
    // In a real application, this would use a safe formula evaluator
    try {
      const formula = question.scoringRules?.formula || 'value';
      // For security reasons, in a real app you'd use a proper formula parser
      // This is just a placeholder
      if (formula === 'value') {
        return Number(response) || 0;
      }
      
      // Very basic formula evaluation - NOT SECURE FOR PRODUCTION
      // In production, use a proper formula evaluator library
      return eval(formula.replace(/value/g, response));
    } catch (e) {
      console.error('Error evaluating custom formula:', e);
      return 0;
    }
  }

  /**
   * Calculate the score for a section based on question scores
   */
  calculateSectionScore(section: Section, questionScores: Record<number, number>): number {
    const sectionQuestionIds = section.questions.map(q => q.id);
    const validScores = sectionQuestionIds
      .map(id => questionScores[id])
      .filter(score => score !== undefined);
    
    if (validScores.length === 0) {
      return 0;
    }

    switch (section.scoringMethod) {
      case 'weighted_average':
        return this.calculateWeightedAverage(section, questionScores);
      case 'sum':
        return this.calculateSum(section, questionScores);
      case 'custom_formula':
        return this.calculateCustomFormula(section, questionScores);
      default:
        return 0;
    }
  }

  /**
   * Calculate weighted average for a section
   */
  private calculateWeightedAverage(section: Section, questionScores: Record<number, number>): number {
    let totalWeight = 0;
    let weightedSum = 0;
    
    section.questions.forEach(question => {
      const score = questionScores[question.id];
      if (score !== undefined) {
        weightedSum += score * question.weight;
        totalWeight += question.weight;
      }
    });
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Calculate sum for a section
   */
  private calculateSum(section: Section, questionScores: Record<number, number>): number {
    return section.questions.reduce((sum, question) => {
      const score = questionScores[question.id];
      return sum + (score !== undefined ? score : 0);
    }, 0);
  }

  /**
   * Calculate custom formula for a section
   */
  private calculateCustomFormula(section: Section, questionScores: Record<number, number>): number {
    // This is a simplified implementation
    // In a real application, this would use a safe formula evaluator
    try {
      const formula = section.formula || 'average';
      
      if (formula === 'average') {
        return this.calculateWeightedAverage(section, questionScores);
      }
      
      // Very basic formula evaluation - NOT SECURE FOR PRODUCTION
      // In production, use a proper formula evaluator library
      const scores = section.questions.map(q => questionScores[q.id] || 0);
      return eval(formula.replace(/scores/g, JSON.stringify(scores)));
    } catch (e) {
      console.error('Error evaluating section custom formula:', e);
      return 0;
    }
  }

  /**
   * Calculate the overall score based on section scores
   */
  calculateOverallScore(
    sectionScores: Record<number, number>, 
    sections: Section[], 
    weights?: Record<string, number>
  ): number {
    const defaultWeights = this.getDefaultWeights(sections);
    const finalWeights = { ...defaultWeights, ...weights };
    
    let totalWeight = 0;
    let weightedSum = 0;
    
    sections.forEach(section => {
      const score = sectionScores[section.id];
      if (score !== undefined) {
        const weight = finalWeights[section.id] || 1;
        weightedSum += score * weight;
        totalWeight += weight;
      }
    });
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Get default weights for sections (equal weighting)
   */
  private getDefaultWeights(sections: Section[]): Record<number, number> {
    const weights: Record<number, number> = {};
    sections.forEach(section => {
      weights[section.id] = section.weight || 1;
    });
    return weights;
  }

  /**
   * Generate a detailed score breakdown for transparency
   */
  generateScoreBreakdown(assessment: Assessment): OverallScoreBreakdown {
    const questionScores: Record<number, number> = {};
    const sectionScores: Record<number, number> = {};
    
    // Calculate question scores
    assessment.sections.forEach(section => {
      section.questions.forEach(question => {
        const response = assessment.responses.find(r => r.questionId === question.id);
        if (response) {
          questionScores[question.id] = this.calculateQuestionScore(question, response.value);
        }
      });
    });
    
    // Calculate section scores
    assessment.sections.forEach(section => {
      sectionScores[section.id] = this.calculateSectionScore(section, questionScores);
    });
    
    // Calculate overall score
    const overallScore = this.calculateOverallScore(sectionScores, assessment.sections, assessment.weights);
    
    // Generate detailed breakdown
    const sectionBreakdowns: SectionScoreBreakdown[] = assessment.sections.map(section => {
      const maxSectionScore = section.scoringMethod === 'sum' 
        ? section.questions.reduce((sum, q) => sum + q.weight, 0)
        : 1; // For weighted average and custom formula, max is 1 (normalized)
      
      const questionBreakdowns: ScoreBreakdown[] = section.questions.map(question => {
        const response = assessment.responses.find(r => r.questionId === question.id);
        const score = questionScores[question.id] || 0;
        const maxScore = question.weight;
        
        return {
          questionId: question.id,
          questionText: question.text,
          response: response?.value,
          score,
          maxScore,
          explanation: this.getExplanation(question, response?.value, score)
        };
      });
      
      return {
        sectionId: section.id,
        sectionName: section.name,
        score: sectionScores[section.id] || 0,
        maxScore: maxSectionScore,
        percentage: ((sectionScores[section.id] || 0) / maxSectionScore) * 100,
        questions: questionBreakdowns
      };
    });
    
    const maxOverallScore = 1; // Normalized to 1
    const overallPercentage = (overallScore / maxOverallScore) * 100;
    
    return {
      overallScore,
      maxOverallScore,
      percentage: overallPercentage,
      sections: sectionBreakdowns
    };
  }

  /**
   * Generate explanation for a question score
   */
  private getExplanation(question: Question, response: any, score: number): string {
    switch (question.type) {
      case 'boolean':
        return `Boolean response: ${response ? 'Yes' : 'No'}. Score: ${score.toFixed(2)}`;
      case 'multiple_choice':
        return `Selected option: ${response}. Score: ${score.toFixed(2)}`;
      case 'numeric_range':
        return `Numeric value: ${response}. Score: ${score.toFixed(2)}`;
      case 'custom_formula':
        return `Custom formula applied to: ${response}. Score: ${score.toFixed(2)}`;
      default:
        return `Score: ${score.toFixed(2)}`;
    }
  }
}

export default ScoringEngine;