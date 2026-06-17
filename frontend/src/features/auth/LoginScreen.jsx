import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Alert from '../../components/common/Alert'
import { useAuth } from './AuthContext'

export default function LoginScreen() {
  const { login } = useAuth()
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  async function onSubmit(data) {
    setApiError('')
    try {
      await login(data)
    } catch (error) {
      setApiError(error.response?.data?.message || 'Không thể đăng nhập, thử lại nhé.')
    }
  }

  return (
    <main className="login-screen">
      <section className="login-card">
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <p className="eyebrow">Mini Booking</p>
          <h1>Đặt phòng họp nhanh, gọn, không drama.</h1>
          <p className="login-copy">Nhập tên và số điện thoại để lấy vé vào bảng đặt phòng hôm nay.</p>
          <Input
            label="Tên"
            placeholder="Alice"
            error={errors.username?.message}
            {...register('username', { required: 'Vui lòng nhập tên', minLength: { value: 2, message: 'Tên tối thiểu 2 ký tự' } })}
          />
          <Input
            label="Số điện thoại"
            placeholder="0901234567"
            error={errors.phone_number?.message}
            {...register('phone_number', {
              required: 'Vui lòng nhập số điện thoại',
              pattern: { value: /^0[0-9]{9}$/, message: 'Số điện thoại phải gồm 10 số và bắt đầu bằng 0' },
            })}
          />
          <Alert message={apiError} type="error" onClose={() => setApiError('')} />
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Đang vào...' : 'Tiếp tục'}</Button>
        </form>
        <aside className="login-art" aria-hidden="true">
          <div className="art-orb art-orb-one" />
          <div className="art-orb art-orb-two" />
          <div className="mini-calendar">
            <span>09:00</span>
            <strong>Meeting Room A</strong>
            <em>6 seats · ready</em>
          </div>
          <div className="floating-badge">No overlap ✨</div>
        </aside>
      </section>
    </main>
  )
}
