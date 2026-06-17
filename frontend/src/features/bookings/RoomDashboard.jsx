import BookingForm from './BookingForm'
import BookingList from './BookingList'
import Alert from '../../components/common/Alert'
import { useBookings } from './BookingContext'

export default function RoomDashboard() {
  const { selectedRoom, loading, error, setError } = useBookings()

  if (!selectedRoom) {
    return <div className="panel-card">Chưa có phòng nào để đặt.</div>
  }

  return (
    <div className="room-dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Lịch phòng</p>
          <h1>{selectedRoom.name}</h1>
          <p className="dashboard-subtitle">Chọn khung giờ phù hợp, hệ thống sẽ tự chặn lịch trùng.</p>
        </div>
        <span className="capacity-pill">{selectedRoom.capacity} chỗ</span>
      </header>
      <Alert message={error} type="error" onClose={() => setError('')} />
      <BookingForm />
      <section className="bookings-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Timeline</p>
            <h2>Booking sắp tới</h2>
          </div>
        </div>
        {loading ? <p>Đang tải...</p> : <BookingList />}
      </section>
    </div>
  )
}
