import { Router } from 'express';
import { prisma } from '../index';
import { catchAsync, createError } from '../middleware/errorHandler';
import Joi from 'joi';

const router = Router();

// Validation schema for Response
const responseSchema = Joi.object({
  company_id: Joi.number().integer().required(),
  question_id: Joi.number().integer().required(),
  value: Joi.string().required(),
  // score is calculated on the backend, not sent in request
});

// Helper function to calculate score based on question type and value
const calculateScore = async (question_id: number, value: string): Promise<number | null> => {
  const question = await prisma.question.findUnique({
    where: { id: question_id },
    include: { options: true },
  });

  if (!question) {
    throw new Error('Question not found for score calculation');
  }

  if (question.type === 'text_input') {
    // Text input questions don't have a score by default
    return null;
  }

  // For other types, find the matching option
  const option = question.options.find(opt => opt.value === value);
  if (!option) {
    throw new Error(`Invalid value '${value}' for question type '${question.type}'`);
  }
  return option.score;
};

// GET /api/v1/responses - Get all responses (optionally filter by company_id or questionnaire_id)
router.get('/', catchAsync(async (req, res) => {
  const { company_id, questionnaire_id } = req.query;
  let whereClause: any = {};

  if (company_id) {
    whereClause.company_id = parseInt(company_id as string, 10);
  }
  if (questionnaire_id) {
    // Filter by questions belonging to a specific questionnaire
    whereClause.question = {
      questionnaire_id: parseInt(questionnaire_id as string, 10),
    };
  }

  const responses = await prisma.response.findMany({
    where: whereClause,
    include: {
      company: { select: { id: true, name: true, logo_url: true } },
      question: { select: { id: true, text: true, type: true, section: true } },
    },
    orderBy: { created_at: 'desc' },
  });
  res.status(200).json(responses);
}));

// GET /api/v1/responses/:id - Get a single response by ID
router.get('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const response = await prisma.response.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      company: true,
      question: { include: { options: true } },
    },
  });

  if (!response) {
    return next(createError('Response not found', 404));
  }

  res.status(200).json(response);
}));

// POST /api/v1/responses - Create or update a response (upsert)
router.post('/', catchAsync(async (req, res, next) => {
  const { error, value } = responseSchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  const { company_id, question_id, value: response_value } = value;

  // Check if company and question exist
  const companyExists = await prisma.company.findUnique({ where: { id: company_id } });
  const questionExists = await prisma.question.findUnique({ where: { id: question_id } });
  if (!companyExists || !questionExists) {
    return next(createError('Invalid company_id or question_id', 400));
  }

  let score: number | null = null;
  try {
    score = await calculateScore(question_id, response_value);
  } catch (calcError) {
    return next(createError((calcError as Error).message, 400));
  }

  const upsertedResponse = await prisma.response.upsert({
    where: {
      company_id_question_id: { company_id, question_id }, // Using the unique constraint
    },
    update: {
      value: response_value,
      score,
    },
    create: {
      company_id,
      question_id,
      value: response_value,
      score,
    },
    include: {
      company: { select: { id: true, name: true } },
      question: { select: { id: true, text: true, section: true } },
    },
  });

  res.status(201).json(upsertedResponse);
}));

// PUT /api/v1/responses/:id - Update a response
router.put('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = responseSchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  const { company_id, question_id, value: response_value } = value; // company_id and question_id should not change in an update

  // Check if company and question exist
  const companyExists = await prisma.company.findUnique({ where: { id: company_id } });
  const questionExists = await prisma.question.findUnique({ where: { id: question_id } });
  if (!companyExists || !questionExists) {
    return next(createError('Invalid company_id or question_id', 400));
  }

  let score: number | null = null;
  try {
    score = await calculateScore(question_id, response_value);
  } catch (calcError) {
    return next(createError((calcError as Error).message, 400));
  }

  const updatedResponse = await prisma.response.update({
    where: { id: parseInt(id, 10) },
    data: {
      value: response_value,
      score,
    },
    include: {
      company: { select: { id: true, name: true } },
      question: { select: { id: true, text: true, section: true } },
    },
  });

  if (!updatedResponse) {
    return next(createError('Response not found', 404));
  }

  res.status(200).json(updatedResponse);
}));

// DELETE /api/v1/responses/:id - Delete a response
router.delete('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.response.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return next(createError('Response not found', 404));
    }
    next(error);
  }
}));

// Bulk upsert responses
router.post('/bulk', catchAsync(async (req, res, next) => {
  const bulkSchema = Joi.object({
    responses: Joi.array().items(responseSchema).min(1).required(),
  });

  const { error, value } = bulkSchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  const { responses } = value;
  const results: any[] = [];
  const errors: any[] = [];

  for (const responsePayload of responses) {
    try {
      const { company_id, question_id, value } = responsePayload;

      const companyExists = await prisma.company.findUnique({ where: { id: company_id } });
      const questionExists = await prisma.question.findUnique({ where: { id: question_id } });
      if (!companyExists || !questionExists) {
        errors.push({ payload: responsePayload, message: 'Invalid company_id or question_id' });
        continue;
      }

      let score: number | null = null;
      try {
        score = await calculateScore(question_id, value);
      } catch (calcError) {
        errors.push({ payload: responsePayload, message: (calcError as Error).message });
        continue;
      }

      const upsertedResponse = await prisma.response.upsert({
        where: { company_id_question_id: { company_id, question_id } },
        update: { value: response_value, score },
        create: { company_id, question_id, value: response_value, score },
      });
      results.push(upsertedResponse);
    } catch (e: any) {
      errors.push({ payload: responsePayload, message: e.message });
    }
  }

  res.status(201).json({
    success_count: results.length,
    failure_count: errors.length,
    results,
    errors,
  });
}));

export { router as responseRoutes };