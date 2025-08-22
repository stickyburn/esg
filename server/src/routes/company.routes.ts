import { Router } from 'express';
import { prisma } from '../index';
import { catchAsync, createError } from '../middleware/errorHandler';
import Joi from 'joi';

const router = Router();

// Validation schema for Company
const companySchema = Joi.object({
  name: Joi.string().required(),
  logo_url: Joi.string().uri().optional().allow(''),
  description: Joi.string().optional().allow(''),
  issuer_id: Joi.number().integer().required(),
});

// GET /api/v1/companies - Get all companies
router.get('/', catchAsync(async (req, res, next) => {
  const { issuer_id } = req.query; // Optional filter by issuer_id
  const whereClause = issuer_id ? { issuer_id: parseInt(issuer_id as string, 10) } : {};

  const companies = await prisma.company.findMany({
    where: whereClause,
    include: { issuer: true }, // Include related issuer details
    orderBy: { created_at: 'desc' },
  });
  res.status(200).json(companies);
}));

// GET /api/v1/companies/:id - Get a single company by ID
router.get('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const company = await prisma.company.findUnique({
    where: { id: parseInt(id, 10) },
    include: { issuer: true }, // Include related issuer
  });

  if (!company) {
    return next(createError('Company not found', 404));
  }

  res.status(200).json(company);
}));

// POST /api/v1/companies - Create a new company
router.post('/', catchAsync(async (req, res, next) => {
  const { error, value } = companySchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  // Check if the associated issuer exists
  const issuerExists = await prisma.issuer.findUnique({
    where: { id: value.issuer_id },
  });
  if (!issuerExists) {
    return next(createError('Associated issuer not found', 400));
  }

  const newCompany = await prisma.company.create({
    data: value,
  });

  res.status(201).json(newCompany);
}));

// PUT /api/v1/companies/:id - Update a company
router.put('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = companySchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  // Check if the associated issuer exists if issuer_id is being updated
  if (value.issuer_id) {
    const issuerExists = await prisma.issuer.findUnique({
      where: { id: value.issuer_id },
    });
    if (!issuerExists) {
      return next(createError('Associated issuer not found', 400));
    }
  }

  const updatedCompany = await prisma.company.update({
    where: { id: parseInt(id, 10) },
    data: value,
  });

  if (!updatedCompany) {
    return next(createError('Company not found', 404));
  }

  res.status(200).json(updatedCompany);
}));

// DELETE /api/v1/companies/:id - Delete a company
router.delete('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.company.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).send(); // No Content
  } catch (error: any) {
    if (error.code === 'P2025') {
      return next(createError('Company not found', 404));
    }
    if (error.code === 'P2003') {
      return next(createError('Cannot delete company because it is associated with responses or reports.', 400));
    }
    next(error);
  }
}));

export { router as companyRoutes };