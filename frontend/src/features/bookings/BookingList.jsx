import Button from '../../components/common/Button'
import { formatDateTime } from '../../utils/formatters'
import { useAuth } from '../auth/AuthContext'
import { useBookings } from './BookingContext'

export default function BookingList() {
  const { username } = useAuth()
  const { bookings, deleteBooking } = useBookings()

  if (bookings.length === 0) {
    return <p className="empty-state">Phòng này đang trống. Một vùng đất booking màu mỡ.</p>
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
            <Button variant="ghost" onClick={() => deleteBooking(booking.id)}>Xóa</Button>
          ) : null}
        </article>
      ))}
    </div>
  )
}
