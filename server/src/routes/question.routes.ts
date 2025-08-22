import { Router } from 'express';
import { prisma } from '../index';
import { catchAsync, createError } from '../middleware/errorHandler';
import Joi from 'joi';

const router = Router();

// Validation schema for Question
const questionSchema = Joi.object({
  questionnaire_id: Joi.number().integer().required(),
  text: Joi.string().required(),
  type: Joi.string().valid('multiple_choice', 'yes_no', 'scale', 'text_input').required(),
  section: Joi.string().valid('Environmental', 'Social', 'Governance').required(),
  order: Joi.number().integer().optional(),
  options: Joi.array().items(
    Joi.object({
      text: Joi.string().required(),
      value: Joi.string().required(),
      score: Joi.number().integer().required(),
    })
  ).optional(), // Options are optional for text_input type, but required for others
});

// Helper function to validate options based on question type
const validateOptions = (question: any) => {
  if (question.type !== 'text_input' && (!question.options || question.options.length < 2)) {
    throw new Error('Options are required for multiple_choice, yes_no, and scale question types.');
  }
  if (question.type === 'text_input' && question.options) {
    throw new Error('Options should not be provided for text_input question type.');
  }
};

// GET /api/v1/questions - Get all questions (optionally filter by questionnaire_id)
router.get('/', catchAsync(async (req, res, next) => {
  const { questionnaire_id } = req.query;
  const whereClause = questionnaire_id ? { questionnaire_id: parseInt(questionnaire_id as string, 10) } : {};

  const questions = await prisma.question.findMany({
    where: whereClause,
    include: { options: true, questionnaire: { select: { name: true } } },
    orderBy: { order: 'asc' },
  });
  res.status(200).json(questions);
}));

// GET /api/v1/questions/:id - Get a single question by ID
router.get('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const question = await prisma.question.findUnique({
    where: { id: parseInt(id, 10) },
    include: { options: true, questionnaire: true },
  });

  if (!question) {
    return next(createError('Question not found', 404));
  }

  res.status(200).json(question);
}));

// POST /api/v1/questions - Create a new question
router.post('/', catchAsync(async (req, res, next) => {
  const { error, value } = questionSchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }
  validateOptions(value);

  const { options, ...questionData } = value;

  // Check if the associated questionnaire exists
  const questionnaireExists = await prisma.questionnaire.findUnique({
    where: { id: value.questionnaire_id },
  });
  if (!questionnaireExists) {
    return next(createError('Associated questionnaire not found', 400));
  }

  const newQuestion = await prisma.question.create({
    data: {
      ...questionData,
      options: options ? {
        create: options,
      } : undefined,
    },
    include: { options: true },
  });

  res.status(201).json(newQuestion);
}));

// PUT /api/v1/questions/:id - Update a question
router.put('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = questionSchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }
  validateOptions(value);

  const { options, ...questionData } = value;

  // Check if the associated questionnaire exists if questionnaire_id is being updated
  if (value.questionnaire_id) {
    const questionnaireExists = await prisma.questionnaire.findUnique({
      where: { id: value.questionnaire_id },
    });
    if (!questionnaireExists) {
      return next(createError('Associated questionnaire not found', 400));
    }
  }

  // For updating options, it's often easier to delete old ones and create new ones
  // to handle additions, deletions, and modifications seamlessly.
  const updatedQuestion = await prisma.question.update({
    where: { id: parseInt(id, 10) },
    data: {
      ...questionData,
      // First, delete all existing options if new ones are provided
      ...(options && {
        options: {
          deleteMany: {},
          create: options,
        },
      }),
    },
    include: { options: true },
  });

  if (!updatedQuestion) {
    return next(createError('Question not found', 404));
  }

  res.status(200).json(updatedQuestion);
}));

// DELETE /api/v1/questions/:id - Delete a question
router.delete('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    // Prisma's cascading delete will handle deleting associated options and responses
    await prisma.question.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return next(createError('Question not found', 404));
    }
    if (error.code === 'P2003') {
      // This case might be less likely if responses are deleted via cascade,
      // but good to be aware if other relations exist later.
      return next(createError('Cannot delete question because it is associated with responses.', 400));
    }
    next(error);
  }
}));

export { router as questionRoutes };