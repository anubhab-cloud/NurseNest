import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { config } from '../config/env';
import { ApiError } from '../middleware/errorHandler';

// ─── Generate Tokens ───────────────────────────────────────────────────────────

const generateTokens = (userId: string, role: string, email: string) => {
  const accessToken = jwt.sign(
    { userId, role, email },
    config.jwt.secret,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    config.jwt.secret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// ─── Register ──────────────────────────────────────────────────────────────────

export const register = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, phone, password, role } = req.body;

  // Check for existing user
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    role: role || 'patient',
  });

  const { accessToken, refreshToken } = generateTokens(
    user._id.toString(),
    user.role,
    user.email
  );

  // Store refresh token
  user.refreshToken = refreshToken;
  await user.save();

  // Set HTTP-only cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
    },
  });
};

// ─── Login ─────────────────────────────────────────────────────────────────────

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account has been deactivated');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const { accessToken, refreshToken } = generateTokens(
    user._id.toString(),
    user.role,
    user.email
  );

  // Update user
  user.lastLogin = new Date();
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
    },
  });
};

// ─── Logout ────────────────────────────────────────────────────────────────────

export const logout = async (req: Request, res: Response): Promise<void> => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user.userId, { refreshToken: null });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
};

// ─── Refresh Token ─────────────────────────────────────────────────────────────

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new ApiError(401, 'Refresh token required');
  }

  const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
  const user = await User.findById(decoded.userId).select('+refreshToken');

  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    user._id.toString(),
    user.role,
    user.email
  );

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true, data: { accessToken } });
};
