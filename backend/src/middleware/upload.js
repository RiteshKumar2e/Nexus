import multer from 'multer'
import path from 'path'
import ApiError from '../utils/ApiError.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      return cb(new ApiError(400, 'Only JPEG, PNG, or WEBP images are allowed.'))
    }
    cb(null, true)
  },
})
