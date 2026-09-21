import expressAsyncHandler from 'express-async-handler'
import Alert from '../models/Alert.js'

export const listAlerts = expressAsyncHandler(async (req, res) => {
  const alerts = await Alert.findAll({ order: [['issuedAt', 'DESC']] })
  res.json({ items: alerts })
})
