import { Router } from 'express';
import { prisma } from '../index';
import { catchAsync, createError } from '../middleware/errorHandler';
import Joi from 'joi';

const router = Router();

// Validation schema for Questionnaire
const questionnaireSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(''),
});

// GET /api/v1/questionnaires - Get all questionnaires
router.get('/', catchAsync(async (req, res, next) => {
  const questionnaires = await prisma.questionnaire.findMany({
    include: {
      _count: {
        select: { questions: true, reports: true },
      },
    },
    orderBy: { created_at: 'desc' },
  });
  res.status(200).json(questionnaires);
}));

// GET /api/v1/questionnaires/:id - Get a single questionnaire by ID
router.get('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const questionnaire = await prisma.questionnaire.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: { options: true },
      },
      scoring_configs: true,
      reports: true,
    },
  });

  if (!questionnaire) {
    return next(createError('Questionnaire not found', 404));
  }

  res.status(200).json(questionnaire);
}));

// POST /api/v1/questionnaires - Create a new questionnaire
router.post('/', catchAsync(async (req, res, next) => {
  const { error, value } = questionnaireSchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  const newQuestionnaire = await prisma.questionnaire.create({
    data: value,
  });

  res.status(201).json(newQuestionnaire);
}));

// PUT /api/v1/questionnaires/:id - Update a questionnaire
router.put('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = questionnaireSchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  const updatedQuestionnaire = await prisma.questionnaire.update({
    where: { id: parseInt(id, 10) },
    data: value,
  });

  if (!updatedQuestionnaire) {
    return next(createError('Questionnaire not found', 404));
  }

  res.status(200).json(updatedQuestionnaire);
}));

// DELETE /api/v1/questionnaires/:id - Delete a questionnaire
router.delete('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.questionnaire.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return next(createError('Questionnaire not found', 404));
    }
    if (error.code === 'P2003') {
      return next(createError('Cannot delete questionnaire because it is associated with questions, scoring configs, or reports.', 400));
    }
    next(error);
  }
}));

export { router as questionnaireRoutes };