export default function RoomItem({ room, active, onSelect }) {
  return (
    <button className={`room-item ${active ? 'active' : ''}`} type="button" onClick={() => onSelect(room)}>
      <strong>{room.name}</strong>
      <span>{room.capacity} chỗ</span>
    </button>
  )
}
