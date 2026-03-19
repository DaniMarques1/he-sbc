export function Header() {
  return (
    <header className="bg-[#fbf8ff] flex justify-between items-center px-8 py-4 w-full sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="font-manrope font-bold text-2xl text-[#1A237E]">Histórico Escolar</h2>
        <div className="bg-surface-container-high px-3 py-1 rounded-full flex items-center gap-2">
          <span className="material-symbols-outlined text-xs text-secondary" data-icon="calendar_today">calendar_today</span>
          <input type="text" defaultValue="18/03/2026" className="text-xs font-medium text-secondary bg-transparent w-18 focus:outline-none text-center" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-l border-outline-variant/30 pl-6">
          <button className="p-2 text-secondary hover:bg-[#e8e7f2] rounded-full transition-colors">
            <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
          </button>
          <button className="p-2 text-secondary hover:bg-[#e8e7f2] rounded-full transition-colors">
            <span className="material-symbols-outlined" data-icon="settings">settings</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/20">
            <img
              alt="Administrator Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV73a9aygR46DAUQXMMifkAJ7jvVDZ7eUwz-qCxAZ0g1_ilaghlSqrtCmjRADIiwfYDMGTAz9tC9MmqDh7q6-3qVWj6wsEXo-VL2YKZskxbGFkgGIWP-vHhC8784iu6FALjgh82Dzv71B06bCUqylN13-jTSCCkHYWMZ9zUhW_OD_C_KOB_-ioSZNuGYBSbOSHn8OX8nxzEO9fpWb_TgikaZoiCyiFyM_n4ZpzIyC2vZRIy2OzMC77vWF_g8Naf2474SZYg4AVZes"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
