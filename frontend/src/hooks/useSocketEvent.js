import { useEffect } from 'react'
import { useSocket } from '../context/SocketContext.jsx'

export function useSocketEvent(eventName, handler, deps = []) {
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return
    socket.on(eventName, handler)
    return () => socket.off(eventName, handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, eventName, ...deps])
}
