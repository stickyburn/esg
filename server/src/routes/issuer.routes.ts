import { Router } from 'express';
import { prisma } from '../index';
import { catchAsync, createError } from '../middleware/errorHandler';
import Joi from 'joi';

const router = Router();

// Validation schema for Issuer
const issuerSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(''),
});

// GET /api/v1/issuers - Get all issuers
router.get('/', catchAsync(async (req, res, next) => {
  const issuers = await prisma.issuer.findMany({
    orderBy: { created_at: 'desc' },
  });
  res.status(200).json(issuers);
}));

// GET /api/v1/issuers/:id - Get a single issuer by ID
router.get('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const issuer = await prisma.issuer.findUnique({
    where: { id: parseInt(id, 10) },
    include: { companies: true }, // Include related companies
  });

  if (!issuer) {
    return next(createError('Issuer not found', 404));
  }

  res.status(200).json(issuer);
}));

// POST /api/v1/issuers - Create a new issuer
router.post('/', catchAsync(async (req, res, next) => {
  const { error, value } = issuerSchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  const newIssuer = await prisma.issuer.create({
    data: value,
  });

  res.status(201).json(newIssuer);
}));

// PUT /api/v1/issuers/:id - Update an issuer
router.put('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = issuerSchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  const updatedIssuer = await prisma.issuer.update({
    where: { id: parseInt(id, 10) },
    data: value,
  });

  if (!updatedIssuer) {
    return next(createError('Issuer not found', 404));
  }

  res.status(200).json(updatedIssuer);
}));

// DELETE /api/v1/issuers/:id - Delete an issuer
router.delete('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.issuer.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).send(); // No Content
  } catch (error: any) {
    // Prisma error for record not found
    if (error.code === 'P2025') {
      return next(createError('Issuer not found', 404));
    }
    // Prisma error for foreign key constraint violation
    if (error.code === 'P2003') {
      return next(createError('Cannot delete issuer because it is associated with companies.', 400));
    }
    next(error); // Pass other errors to the global handler
  }
}));

export { router as issuerRoutes };