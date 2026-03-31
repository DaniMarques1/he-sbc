import { useState, useEffect } from 'react';

interface HeaderProps {
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export function Header({ isMobileMenuOpen, onToggleMobileMenu }: HeaderProps) {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, []);

  return (
    <header className="bg-[#fbf8ff] flex flex-col w-full sticky top-0 z-40 border-b border-transparent md:border-none transition-all">
      <div className="flex justify-between items-center px-4 md:px-8 py-4 w-full">
        <div className="flex items-center gap-2 md:gap-4">
          <div 
            className="flex items-center gap-2 md:gap-4 cursor-pointer md:cursor-auto select-none" 
            onClick={onToggleMobileMenu}
          >
            {onToggleMobileMenu && (
              <button className="md:hidden p-2 text-secondary hover:bg-[#e8e7f2] rounded-full transition-colors">
                <span className="material-symbols-outlined" data-icon={isMobileMenuOpen ? "close" : "menu"}>
                  {isMobileMenuOpen ? "close" : "menu"}
                </span>
              </button>
            )}
            <h2 className="font-manrope font-bold text-lg md:text-2xl text-[#1A237E]">Histórico Escolar</h2>
          </div>
          <div className="hidden md:flex bg-surface-container-high px-3 py-1 rounded-full items-center gap-2 relative">
            <span className="material-symbols-outlined text-xs text-secondary" data-icon="calendar_today">calendar_today</span>
            <input 
              type="date" 
              name="DATA_CABECALHO"
              form="historicoForm"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="text-xs font-medium text-secondary bg-transparent focus:outline-none text-center cursor-pointer w-[100px] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
            />
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 md:gap-4 border-none md:border-solid md:border-l border-outline-variant/30 pl-0 md:pl-6">
            <button className="hidden md:block p-2 text-secondary hover:bg-[#e8e7f2] rounded-full transition-colors">
              <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
            </button>
            <button className="hidden md:block p-2 text-secondary hover:bg-[#e8e7f2] rounded-full transition-colors">
              <span className="material-symbols-outlined" data-icon="settings">settings</span>
            </button>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/20">
              <img
                alt="Administrator Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV73a9aygR46DAUQXMMifkAJ7jvVDZ7eUwz-qCxAZ0g1_ilaghlSqrtCmjRADIiwfYDMGTAz9tC9MmqDh7q6-3qVWj6wsEXo-VL2YKZskxbGFkgGIWP-vHhC8784iu6FALjgh82Dzv71B06bCUqylN13-jTSCCkHYWMZ9zUhW_OD_C_KOB_-ioSZNuGYBSbOSHn8OX8nxzEO9fpWb_TgikaZoiCyiFyM_n4ZpzIyC2vZRIy2OzMC77vWF_g8Naf2474SZYg4AVZes"
              />
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/10 bg-[#fbf8ff] shadow-sm pb-2">
          <nav className="flex flex-col">
            <a className="flex items-center gap-4 px-6 py-3 text-[#1A237E] bg-primary-container/10 font-manrope font-semibold" href="#">
              <span className="material-symbols-outlined" data-icon="description">description</span>
              <span className="text-sm">Histórico Escolar</span>
            </a>
            <a className="flex items-center gap-4 px-6 py-3 text-[#585c80] hover:bg-[#e2e1ed] transition-colors font-manrope font-semibold" href="#">
              <span className="material-symbols-outlined" data-icon="contact_support">contact_support</span>
              <span className="text-sm">Support</span>
            </a>
            <a className="flex items-center gap-4 px-6 py-3 text-[#585c80] hover:bg-[#e2e1ed] transition-colors font-manrope font-semibold" href="#">
              <span className="material-symbols-outlined" data-icon="logout">logout</span>
              <span className="text-sm">Sign Out</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
