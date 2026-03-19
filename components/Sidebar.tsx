export function Sidebar() {
  return (
    <nav className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-[#f3f2fe] flex flex-col py-6 z-50">
      <div className="px-8 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white" data-icon="school">school</span>
          </div>
          <div>
            <h1 className="font-manrope font-black text-[#1A237E] leading-none tracking-tight">Gerador de Histórico Escolar</h1>
            <span className="text-[10px] font-manrope font-semibold tracking-widest text-secondary uppercase">HE - SBC</span>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-1">
        <a className="flex items-center gap-4 bg-white text-[#1A237E] rounded-l-full ml-4 pl-4 py-3 shadow-sm transition-all translate-x-1 duration-200" href="#">
          <span className="material-symbols-outlined" data-icon="description">description</span>
          <span className="font-manrope font-semibold text-sm tracking-wide">Histórico Escolar</span>
        </a>
      </div>
      <div className="mt-auto space-y-1">
        <a className="flex items-center gap-4 text-[#585c80] hover:text-[#1A237E] px-8 py-3 transition-all hover:bg-[#e2e1ed]" href="#">
          <span className="material-symbols-outlined" data-icon="contact_support">contact_support</span>
          <span className="font-manrope font-semibold text-sm tracking-wide">Support</span>
        </a>
        <a className="flex items-center gap-4 text-[#585c80] hover:text-[#1A237E] px-8 py-3 transition-all hover:bg-[#e2e1ed]" href="#">
          <span className="material-symbols-outlined" data-icon="logout">logout</span>
          <span className="font-manrope font-semibold text-sm tracking-wide">Sign Out</span>
        </a>
      </div>
    </nav>
  );
}
