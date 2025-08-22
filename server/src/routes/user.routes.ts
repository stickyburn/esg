import { Router } from 'express';
import { prisma } from '../index';
import { catchAsync, createError } from '../middleware/errorHandler';
import Joi from 'joi';
import bcrypt from 'bcryptjs'; // For password hashing
import { generateToken } from '../middleware/auth';

const router = Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('admin', 'user').optional().default('user'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// POST /api/v1/users/register - Register a new user
router.post('/register', catchAsync(async (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  const { email, password, role } = value;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return next(createError('User with this email already exists.', 409)); // 409 Conflict
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword, // Store hashed password
      role,
    },
    select: { // Exclude password from response
      id: true,
      email: true,
      role: true,
      created_at: true,
    },
  });

  // Generate JWT token
  const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

  res.status(201).json({
    message: 'User registered successfully.',
    user: newUser,
    token,
  });
}));

// POST /api/v1/users/login - Log in an existing user
router.post('/login', catchAsync(async (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return next(createError(error.details[0].message, 400));
  }

  const { email, password } = value;

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) { // Ensure user.password exists
    return next(createError('Incorrect email or password.', 401));
  }

  // Compare password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(createError('Incorrect email or password.', 401));
  }

  // Generate JWT token
  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  // Exclude password from response
  const { password: _, ...userWithoutPassword } = user;

  res.status(200).json({
    message: 'Login successful.',
    user: userWithoutPassword,
    token,
  });
}));

// TODO: Add other CRUD operations for Users (GET, PUT, DELETE)
// These would typically be protected and restricted to 'admin' users.
// For example:
// GET /api/v1/users - Get all users (admin only)
// router.get('/', authenticate, authorize(['admin']), catchAsync(...));
// GET /api/v1/users/:id - Get a single user by ID (admin or the user themselves)
// PUT /api/v1/users/:id - Update a user (admin or the user themselves)
// DELETE /api/v1/users/:id - Delete a user (admin only)

export { router as userRoutes };