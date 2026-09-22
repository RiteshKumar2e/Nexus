import expressAsyncHandler from 'express-async-handler'
import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import { signToken } from '../utils/jwt.js'

export const register = expressAsyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password) throw new ApiError(400, 'Name, email, and password are required.')

  const existing = await User.findOne({ where: { email: email.toLowerCase() } })
  if (existing) throw new ApiError(409, 'An account with this email already exists.')

  const allowedRoles = ['COMMANDER', 'OPERATOR', 'VIEWER']
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: allowedRoles.includes(role) ? role : 'OPERATOR',
  })

  const token = signToken(user)
  res.status(201).json({ token, user: user.toSafeObject() })
})

export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw new ApiError(400, 'Email and password are required.')

  const user = await User.unscoped().findOne({ where: { email: email.toLowerCase() } })
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password.')
  }

  const token = signToken(user)
  res.json({ token, user: user.toSafeObject() })
})

export const me = expressAsyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeObject() })
})

export const updateProfile = expressAsyncHandler(async (req, res) => {
  const { name } = req.body
  if (!name || !name.trim()) throw new ApiError(400, 'Name is required.')

  req.user.name = name.trim()
  await req.user.save()
  res.json({ user: req.user.toSafeObject() })
})

export const updatePassword = expressAsyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) throw new ApiError(400, 'Current and new password are required.')
  if (newPassword.length < 8) throw new ApiError(400, 'New password must be at least 8 characters.')

  const user = await User.unscoped().findByPk(req.user.id)
  if (!(await user.comparePassword(currentPassword))) throw new ApiError(401, 'Current password is incorrect.')

  user.password = newPassword
  await user.save()
  res.json({ message: 'Password updated.' })
})
