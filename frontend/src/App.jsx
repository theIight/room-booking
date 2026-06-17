import SplitScreenLayout from './components/layout/SplitScreenLayout'
import { AuthProvider, useAuth } from './features/auth/AuthContext'
import LoginScreen from './features/auth/LoginScreen'
import { BookingProvider, useBookings } from './features/bookings/BookingContext'
import RoomDashboard from './features/bookings/RoomDashboard'
import RoomList from './features/rooms/RoomList'
import './App.css'

function BookingApp() {
  const { auth, username, logout } = useAuth()

  if (!auth) {
    return <LoginScreen />
  }

  return (
    <BookingProvider>
      <Shell username={username} logout={logout} />
    </BookingProvider>
  )
}

function Shell({ username, logout }) {
  const { rooms, selectedRoom, setSelectedRoom } = useBookings()

  return (
    <SplitScreenLayout
      sidebar={
        <>
          <div className="brand-block">
            <div className="brand-icon">B</div>
            <p className="eyebrow">Co-working</p>
            <h2>Mini Booking</h2>
            <p>Xin chào, <strong>{username}</strong></p>
          </div>
          <RoomList rooms={rooms} selectedRoom={selectedRoom} onSelect={setSelectedRoom} />
          <button className="logout-link" type="button" onClick={logout}>Đăng xuất</button>
        </>
      }
    >
      <RoomDashboard />
    </SplitScreenLayout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BookingApp />
    </AuthProvider>
  )
}
