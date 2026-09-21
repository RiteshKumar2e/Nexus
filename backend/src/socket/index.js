import { Server } from 'socket.io'
import { getAllowedOrigins } from '../config/corsOrigins.js'

let io = null

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: getAllowedOrigins(),
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    console.log(`[socket] client connected: ${socket.id}`)
    socket.on('disconnect', () => {
      console.log(`[socket] client disconnected: ${socket.id}`)
    })
  })

  return io
}

export function getIO() {
  if (!io) {
    console.warn('[socket] getIO() called before initSocket()')
    return { emit: () => {} }
  }
  return io
}

export function emitEvent(event, payload) {
  getIO().emit(event, { ...payload, timestamp: new Date().toISOString() })
}
