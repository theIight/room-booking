export default function Input({ label, error, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
      {error ? <small className="error">{error}</small> : null}
    </label>
  )
}
