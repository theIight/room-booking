import RoomItem from './RoomItem'

export default function RoomList({ rooms, selectedRoom, onSelect }) {
  return (
    <div className="room-list">
      {rooms.map((room) => (
        <RoomItem key={room.id} room={room} active={selectedRoom?.id === room.id} onSelect={onSelect} />
      ))}
    </div>
  )
}
