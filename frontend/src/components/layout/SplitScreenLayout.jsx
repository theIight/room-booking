export default function SplitScreenLayout({ sidebar, children }) {
  return (
    <main className="app-shell">
      <aside className="sidebar">{sidebar}</aside>
      <section className="dashboard-panel">{children}</section>
    </main>
  )
}
