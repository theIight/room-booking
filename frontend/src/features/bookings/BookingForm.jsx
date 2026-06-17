import { useMemo, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Alert from '../../components/common/Alert'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const today = dateInputValue()

  const { register, handleSubmit, watch, setValue, clearErrors, formState: { errors } } = useForm({
    defaultValues: {
      date: today,
      startTime: '',
      endTime: '',
    }
  })

  const selectedDate = watch('date')
  const startTime = watch('startTime')
  const endTime = watch('endTime')

  const parsedBookings = useMemo(() => {
    return bookings.map((booking) => ({
      start: new Date(booking.start_time),
      end: new Date(booking.end_time),
    }))
  }, [bookings])

  const validStartTimes = useMemo(() => {
    if (!selectedDate) return []
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
    if (!selectedDate || !startTime) return []

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
    setValue('startTime', '')
    setValue('endTime', '')
    setApiError('')
    clearErrors()
  }, [selectedRoom, selectedDate, setValue, clearErrors])

  const selectedStart = startTime && selectedDate ? timeToDate(selectedDate, startTime) : null
  const selectedEnd = endTime && selectedDate ? timeToDate(selectedDate, endTime) : null
  const canSubmit = selectedRoom && !isSubmitting

  async function onSubmit(data) {
    setApiError('')
    setIsSubmitting(true)
    try {
      const start = timeToDate(data.date, data.startTime)
      const end = timeToDate(data.date, data.endTime)
      await createBooking({
        start_time: start,
        end_time: end,
      })
      setValue('startTime', '')
      setValue('endTime', '')
    } catch (error) {
      const errorsBag = error.response?.data?.errors
      const firstError = errorsBag ? Object.values(errorsBag).flat()[0] : null
      setApiError(firstError || error.response?.data?.message || 'Không tạo được booking.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="booking-form schedule-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="booking-person">
        <p className="eyebrow">Booking as</p>
        <strong>{username}</strong>
      </div>
      <Input
        label="Ngày đặt"
        type="date"
        min={today}
        error={errors.date?.message}
        {...register('date', { required: 'Vui lòng chọn ngày đặt.' })}
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
              {...register('startTime', {
                required: 'Vui lòng chọn giờ bắt đầu.',
                onChange: () => {
                  setValue('endTime', '')
                  setApiError('')
                  clearErrors('endTime')
                }
              })}
            >
              <option value="">-- Chọn giờ bắt đầu --</option>
              {validStartTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.startTime?.message ? <small className="error">{errors.startTime.message}</small> : null}
          </label>

          <label className="field">
            <span>Giờ kết thúc</span>
            <select
              disabled={!startTime}
              {...register('endTime', { required: 'Vui lòng chọn giờ kết thúc.' })}
            >
              <option value="">-- Chọn giờ kết thúc --</option>
              {validEndTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.endTime?.message ? <small className="error">{errors.endTime.message}</small> : null}
          </label>
        </div>
        <p className="slot-help">Hệ thống hỗ trợ đặt tối thiểu 1 giờ, tối đa 8 giờ và tự động chặn các giờ trùng lịch.</p>
      </div>
      
      <Alert message={apiError} type="error" onClose={() => setApiError('')} />
      <Button type="submit" disabled={!canSubmit || isSubmitting}>
        {isSubmitting ? 'Đang đặt...' : 'Đặt phòng'}
      </Button>
    </form>
  )
}
