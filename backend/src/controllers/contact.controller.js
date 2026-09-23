import expressAsyncHandler from 'express-async-handler'
import ContactMessage, { INQUIRY_TYPES } from '../models/ContactMessage.js'
import ApiError from '../utils/ApiError.js'

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export const submitContact = expressAsyncHandler(async (req, res) => {
  const name = clean(req.body.name, 120)
  const phone = clean(req.body.phone, 20)
  const email = clean(req.body.email, 160)
  const organization = clean(req.body.organization, 160)
  const district = clean(req.body.district, 60)
  const address = clean(req.body.address, 500)
  const message = clean(req.body.message, 3000)
  const inquiryType = INQUIRY_TYPES.includes(req.body.inquiryType) ? req.body.inquiryType : 'OTHER'

  if (!name) throw new ApiError(400, 'Name is required.')
  if (!/^[+\d][\d\s-]{7,18}$/.test(phone)) throw new ApiError(400, 'Enter a valid phone number.')
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError(400, 'Enter a valid email address.')
  if (message.length < 10) throw new ApiError(400, 'Message should be at least 10 characters.')

  const entry = await ContactMessage.create({
    name, phone, email: email || null, organization: organization || null,
    district: district || null, address: address || null, inquiryType, message,
  })

  res.status(201).json({ id: entry.id, message: 'Thanks — your message has been received.' })
})
