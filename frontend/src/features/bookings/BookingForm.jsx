import { useMemo, useState, useEffect } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAuth } from '../auth/AuthContext'
import { useBookings } from './BookingContext'

const START_TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

const END_TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor((i + 1) / 2)).padStart(2, '0')
  const m = (i + 1) % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

function dateInputValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function timeToDate(dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hours, minutes] = timeStr.split(':').map(Number)
  return new Date(year, month - 1, day, hours, minutes, 0, 0)
}

function formatSlotTime(date) {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB
}

export default function BookingForm() {
  const { username } = useAuth()
  const { selectedRoom, bookings, createBooking } = useBookings()
  const [apiError, setApiError] = useState('')
  const [selectedDate, setSelectedDate] = useState(dateInputValue())
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const today = dateInputValue()

  const parsedBookings = useMemo(() => {
    return bookings.map((booking) => ({
      start: new Date(booking.start_time),
      end: new Date(booking.end_time),
    }))
  }, [bookings])

  const validStartTimes = useMemo(() => {
    const now = new Date()
    return START_TIMES.filter((timeStr) => {
      const S = timeToDate(selectedDate, timeStr)
      if (S <= now) return false

      const minEnd = new Date(S.getTime() + 60 * 60 * 1000)
      const dayEnd = timeToDate(selectedDate, '24:00')
      if (minEnd > dayEnd) return false

      return !parsedBookings.some((b) => rangesOverlap(S, minEnd, b.start, b.end))
    })
  }, [selectedDate, parsedBookings])

  const validEndTimes = useMemo(() => {
    if (!startTime) return []

    const S = timeToDate(selectedDate, startTime)
    const minEnd = new Date(S.getTime() + 60 * 60 * 1000)
    const maxEnd = new Date(S.getTime() + 8 * 60 * 60 * 1000)

    let firstConflictStart = timeToDate(selectedDate, '24:00')
    for (const b of parsedBookings) {
      if (b.start >= S && b.start < firstConflictStart) {
        firstConflictStart = b.start
      }
    }

    const limitEnd = new Date(Math.min(maxEnd.getTime(), firstConflictStart.getTime()))

    return END_TIMES.filter((timeStr) => {
      const E = timeToDate(selectedDate, timeStr)
      return E >= minEnd && E <= limitEnd
    })
  }, [startTime, selectedDate, parsedBookings])

  useEffect(() => {
    setStartTime('')
    setEndTime('')
    setApiError('')
  }, [selectedRoom, selectedDate])

  const selectedStart = startTime ? timeToDate(selectedDate, startTime) : null
  const selectedEnd = endTime ? timeToDate(selectedDate, endTime) : null
  const canSubmit = selectedRoom && startTime && endTime && !isSubmitting

  function resetSelection() {
    setStartTime('')
    setEndTime('')
    setApiError('')
  }

  function handleDateChange(event) {
    setSelectedDate(event.target.value)
    resetSelection()
  }

  async function onSubmit(event) {
    event.preventDefault()
    setApiError('')

    if (!canSubmit) {
      setApiError('Vui lòng chọn đầy đủ thông tin đặt phòng họp.')
      return
    }

    setIsSubmitting(true)
    try {
      await createBooking({
        start_time: selectedStart,
        end_time: selectedEnd,
      })
      resetSelection()
    } catch (error) {
      const errorsBag = error.response?.data?.errors
      const firstError = errorsBag ? Object.values(errorsBag).flat()[0] : null
      setApiError(firstError || error.response?.data?.message || 'Không tạo được booking.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="booking-form schedule-form" onSubmit={onSubmit}>
      <div className="booking-person">
        <p className="eyebrow">Booking as</p>
        <strong>{username}</strong>
      </div>
      <Input
        label="Ngày đặt"
        type="date"
        min={today}
        value={selectedDate}
        onChange={handleDateChange}
      />
      <div className="schedule-summary">
        <span>Bắt đầu</span>
        <strong>{selectedStart ? formatSlotTime(selectedStart) : '--:--'}</strong>
      </div>
      <div className="schedule-summary">
        <span>Kết thúc</span>
        <strong>{selectedEnd ? formatSlotTime(selectedEnd) : '--:--'}</strong>
      </div>
      
      <div className="time-select-container">
        <div className="time-select-header">
          <p className="eyebrow">Schedule</p>
          <h3>Chọn thời gian họp</h3>
        </div>
        
        <div className="time-select-fields">
          <label className="field">
            <span>Giờ bắt đầu</span>
            <select
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value)
                setEndTime('')
                setApiError('')
              }}
            >
              <option value="">-- Chọn giờ bắt đầu --</option>
              {validStartTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Giờ kết thúc</span>
            <select
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value)
                setApiError('')
              }}
              disabled={!startTime}
            >
              <option value="">-- Chọn giờ kết thúc --</option>
              {validEndTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="slot-help">Hệ thống hỗ trợ đặt tối thiểu 1 giờ, tối đa 8 giờ và tự động chặn các giờ trùng lịch.</p>
      </div>
      
      {apiError ? <p className="error banner-error">{apiError}</p> : null}
      <Button type="submit" disabled={!canSubmit || isSubmitting}>
        {isSubmitting ? 'Đang đặt...' : 'Đặt phòng'}
      </Button>
    </form>
  )
}
