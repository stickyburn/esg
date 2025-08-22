import { Router } from 'express';
import { prisma } from '../index';
import { catchAsync, createError } from '../middleware/errorHandler';
import Joi from 'joi';

const router = Router();

// Validation schema for ScoringConfig
const scoringConfigSchema = Joi.object({
  questionnaire_id: Joi.number().integer().required(),
  section: Joi.string().valid('Environmental', 'Social', 'Governance').required(),
  aggregation_method: Joi.string().valid('sum', 'average', 'weighted_average').required(),
  weight: Joi.number().min(0).required(),
});

// GET /api/v1/scoring-configs - Get all scoring configs (optionally filter by questionnaire_id)
router.get('/', catchAsync(async (req, res, next) => {
  const { questionnaire_id } = req.query;
  const whereClause = questionnaire_id ? { questionnaire_id: parseInt(questionnaire_id as string, 10) } : {};

  const scoringConfigs = await prisma.scoringConfig.findMany({
    where: whereClause,
    include: { questionnaire: { select: { id: true, name: true } } },
    orderBy: [
      { questionnaire_id: 'asc' },
      { section: 'asc' }
    ],
  });
  res.status(200).json(scoringConfigs);
}));

// GET /api/v1/scoring-configs/:id - Get a single scoring config by ID
router.get('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const scoringConfig = await prisma.scoringConfig.findUnique({
    where: { id: parseInt(id, 10) },
    include: { questionnaire: true },
  });

  if (!scoringConfig) {
    return next(createError('Scoring config not found', 404));
  }

  res.status(200).json(scoringConfig);
}));

// POST /api/v1/scoring-configs - Create a new scoring config
router.post('/', catchAsync(async (req, res, next) => {
  const { error, value } = scoringConfigSchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  // Check if the associated questionnaire exists
  const questionnaireExists = await prisma.questionnaire.findUnique({
    where: { id: value.questionnaire_id },
  });
  if (!questionnaireExists) {
    return next(createError('Associated questionnaire not found', 400));
  }

  // Check for uniqueness constraint (questionnaire_id, section)
  const existingConfig = await prisma.scoringConfig.findUnique({
    where: {
      questionnaire_id_section: {
        questionnaire_id: value.questionnaire_id,
        section: value.section,
      },
    },
  });
  if (existingConfig) {
    return next(createError(`A scoring configuration for section '${value.section}' already exists for this questionnaire.`, 409)); // 409 Conflict
  }

  const newScoringConfig = await prisma.scoringConfig.create({
    data: value,
  });

  res.status(201).json(newScoringConfig);
}));

// PUT /api/v1/scoring-configs/:id - Update a scoring config
router.put('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = scoringConfigSchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  // Check if the associated questionnaire exists if questionnaire_id is being updated
  if (value.questionnaire_id) {
    const questionnaireExists = await prisma.questionnaire.findUnique({
      where: { id: value.questionnaire_id },
    });
    if (!questionnaireExists) {
      return next(createError('Associated questionnaire not found', 400));
    }
  }
  
  // Check for uniqueness constraint if questionnaire_id or section is being updated
  const currentConfig = await prisma.scoringConfig.findUnique({ where: { id: parseInt(id, 10) } });
  if (!currentConfig) {
    return next(createError('Scoring config not found', 404));
  }

  if (value.questionnaire_id !== currentConfig.questionnaire_id || value.section !== currentConfig.section) {
    const existingConfig = await prisma.scoringConfig.findUnique({
      where: {
        questionnaire_id_section: {
          questionnaire_id: value.questionnaire_id,
          section: value.section,
        },
      },
    });
    if (existingConfig && existingConfig.id !== parseInt(id, 10)) {
      return next(createError(`A scoring configuration for section '${value.section}' already exists for this questionnaire.`, 409));
    }
  }

  const updatedScoringConfig = await prisma.scoringConfig.update({
    where: { id: parseInt(id, 10) },
    data: value,
  });

  res.status(200).json(updatedScoringConfig);
}));

// DELETE /api/v1/scoring-configs/:id - Delete a scoring config
router.delete('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.scoringConfig.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return next(createError('Scoring config not found', 404));
    }
    // P2003 might occur if it's linked elsewhere, though schema doesn't show direct links from other tables
    if (error.code === 'P2003') {
      return next(createError('Cannot delete scoring config due to existing dependencies.', 400));
    }
    next(error);
  }
}));

export { router as scoringConfigRoutes };