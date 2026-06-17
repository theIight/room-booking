import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../../services/api'
import { toUtcIso } from '../../utils/formatters'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchRooms() {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/rooms', { params: { per_page: 50 } })
      const nextRooms = response.data.data
      setRooms(nextRooms)
      setSelectedRoom((current) => current || nextRooms[0] || null)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không tải được danh sách phòng.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchBookings(roomId = selectedRoom?.id) {
    if (!roomId) return

    setLoading(true)
    setError('')
    try {
      const response = await api.get(`/rooms/${roomId}/bookings`, { params: { per_page: 100 } })
      setBookings(response.data.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không tải được lịch booking.')
    } finally {
      setLoading(false)
    }
  }

  async function createBooking(data) {
    if (!selectedRoom) return

    const payload = {
      room_id: selectedRoom.id,
      start_time: toUtcIso(data.start_time),
      end_time: toUtcIso(data.end_time),
    }

    await api.post('/bookings', payload)
    await fetchBookings(selectedRoom.id)
  }

  async function deleteBooking(id) {
    setError('')
    try {
      await api.delete(`/bookings/${id}`)
      await fetchBookings(selectedRoom?.id)
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Không thể xóa lịch đặt.'
      setError(message)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  useEffect(() => {
    if (selectedRoom) {
      fetchBookings(selectedRoom.id)
    }
  }, [selectedRoom])

  const value = useMemo(() => ({
    rooms,
    selectedRoom,
    setSelectedRoom,
    bookings,
    loading,
    error,
    setError,
    fetchRooms,
    fetchBookings,
    createBooking,
    deleteBooking,
  }), [rooms, selectedRoom, bookings, loading, error])

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBookings() {
  return useContext(BookingContext)
}
