import { useState } from 'react'
import Button from '../../components/common/Button'
import ConfirmModal from '../../components/common/ConfirmModal'
import { formatDateTime } from '../../utils/formatters'
import { useAuth } from '../auth/AuthContext'
import { useBookings } from './BookingContext'

export default function BookingList() {
  const { username } = useAuth()
  const { bookings, deleteBooking } = useBookings()
  const [deleteId, setDeleteId] = useState(null)

  if (bookings.length === 0) {
    return <p className="empty-state">Phòng này đang trống. Một vùng đất booking màu mỡ.</p>
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
  }

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteBooking(deleteId)
      setDeleteId(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteId(null)
  }

  return (
    <div className="booking-list">
      {bookings.map((booking) => (
        <article className="booking-card" key={booking.id}>
          <div className="booking-avatar">{booking.user_name.slice(0, 1).toUpperCase()}</div>
          <div>
            <strong>{booking.user_name}</strong>
            <span>{formatDateTime(booking.start_time)} → {formatDateTime(booking.end_time)}</span>
          </div>
          {booking.user_name === username ? (
            <Button variant="ghost" onClick={() => handleDeleteClick(booking.id)}>Xóa</Button>
          ) : null}
        </article>
      ))}

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Xóa lịch đặt phòng"
        message="Bạn có chắc chắn muốn xóa lịch đặt phòng họp này không? Hành động này không thể hoàn tác."
        confirmText="Xóa lịch"
        cancelText="Hủy bỏ"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}
