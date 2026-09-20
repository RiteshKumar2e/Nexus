import expressAsyncHandler from 'express-async-handler'
import { verifyToken } from '../utils/jwt.js'
import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'

export const requireAuth = expressAsyncHandler(async (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required.')
  }
  const token = header.split(' ')[1]
  let decoded
  try {
    decoded = verifyToken(token)
  } catch {
    throw new ApiError(401, 'Invalid or expired session.')
  }
  const user = await User.findByPk(decoded.id)
  if (!user) throw new ApiError(401, 'User no longer exists.')
  req.user = user
  next()
})

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action.')
    }
    next()
  }
}
