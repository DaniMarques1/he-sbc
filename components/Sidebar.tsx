"use client";

import { usePathname } from 'next/navigation';

export function Sidebar({ user }: { user?: any }) {
  const pathname = usePathname();
  const isProfileComplete = user?.user_metadata?.emeb_name && user?.user_metadata?.emeb_cep;

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;
    return isActive
      ? "flex items-center gap-4 bg-white text-[#1A237E] rounded-l-full ml-4 pl-4 py-3 shadow-sm transition-all translate-x-1 duration-200"
      : "flex items-center gap-4 text-[#585c80] hover:text-[#1A237E] rounded-l-full ml-4 pl-4 py-3 transition-all hover:bg-[#e2e1ed]";
  };

  return (
    <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r-0 bg-[#f3f2fe] flex-col py-6 z-50">
      <div className="px-8 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 min-w-10 bg-primary-container rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white" data-icon="school">school</span>
          </div>
          <div>
            <h1 className="font-manrope font-black text-[#1A237E] leading-tight tracking-tight text-sm">Gerador de Histórico Escolar</h1>
            <span className="text-[10px] font-manrope font-semibold tracking-widest text-secondary uppercase">HE - SBC</span>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-1">
        <a className={getLinkClasses("/")} href="/">
          <span className="material-symbols-outlined" data-icon="description">description</span>
          <span className="font-manrope font-semibold text-sm tracking-wide">Histórico Escolar</span>
        </a>
        <a className={getLinkClasses("/profile")} href={user ? "/profile" : "/login"}>
          <span className="material-symbols-outlined" data-icon="manage_accounts">manage_accounts</span>
          <span className="font-manrope font-semibold text-sm tracking-wide flex items-center gap-2">
            Meu Perfil
            {user && !isProfileComplete && (
              <span className="bg-error text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-full animate-pulse tracking-wider">Pendente</span>
            )}
          </span>
        </a>
        <a className={getLinkClasses("/templates")} href={user ? "/templates" : "/login"}>
          <span className="material-symbols-outlined" data-icon="folder_special">folder_special</span>
          <span className="font-manrope font-semibold text-sm tracking-wide">Meus Templates</span>
        </a>
      </div>
      <div className="mt-auto px-6 pb-6 w-full">
        <button
          onClick={() => {
            navigator.clipboard.writeText('48197@emeb.saobernardo.sp.gov.br');
            window.dispatchEvent(new CustomEvent('show_toast', { detail: 'E-mail copiado: 48197@emeb.saobernardo.sp.gov.br' }));
          }}
          className="bg-gradient-to-br from-[#1A237E]/5 to-[#1A237E]/10 border border-[#1A237E]/10 rounded-2xl p-4 flex gap-3 shadow-sm relative overflow-hidden group hover:border-[#1A237E]/30 hover:bg-[#1A237E]/10 transition-all block text-left w-full focus:outline-none"
          title="Clique para copiar o e-mail"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 text-[#1A237E] relative z-10 group-hover:bg-[#1A237E] group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]" data-icon="contact_mail">contact_mail</span>
          </div>
          <div className="flex flex-col relative z-10 w-full">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A237E]/60 mb-0.5">Desenvolvedor</span>
            <span className="text-xs font-black text-[#1A237E] leading-tight whitespace-nowrap">Daniel Marques de S.</span>
            <span className="text-[10px] font-bold text-[#585c80] mt-1">Oficial de Escola</span>
            <span className="text-[9px] font-medium text-secondary/70">Matrícula: 48197-6</span>
            <div className="mt-2 text-[9px] font-bold text-white bg-[#1A237E] py-1 px-2 rounded-lg text-center flex items-center justify-center gap-1 group-hover:bg-[#1A237E]/80 transition-colors">
              <span className="material-symbols-outlined text-[10px]" data-icon="mail">mail</span> Enviar E-mail
            </div>
          </div>
        </button>
      </div>
    </nav>
  );
}
