import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  isPending?: boolean;
}

export function Header({ isMobileMenuOpen, onToggleMobileMenu, isPending }: HeaderProps) {
  const [currentDate, setCurrentDate] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setCurrentDate(`${year}-${month}-${day}`);
    
    // Fetch User
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsUserLoaded(true);
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsUserLoaded(true);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <header className="bg-[#fbf8ff] flex flex-col w-full sticky top-0 z-40 border-b border-transparent md:border-none transition-all">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 w-full max-w-7xl mx-auto">
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
            <div className="hidden md:flex items-center gap-2 mr-2">
              <button
                type="submit"
                form="historicoForm"
                name="action"
                value="doc"
                disabled={isPending}
                className="bg-surface-container-high text-on-primary-fixed-variant px-4 py-2 rounded-lg font-manrope font-bold text-xs hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
              >
                <span className="material-symbols-outlined text-[16px]" data-icon="docs">docs</span>
                {isPending ? "Gerando..." : "DOC"}
              </button>
              <button
                type="submit"
                form="historicoForm"
                name="action"
                value="pdf"
                className="bg-surface-container-high text-on-primary-fixed-variant px-4 py-2 rounded-lg font-manrope font-bold text-xs hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]" data-icon="print">print</span>
                PDF
              </button>
            </div>
            {isUserLoaded ? (
              user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-primary hidden md:block">
                    {user.user_metadata?.institution_name || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-surface-container-highest text-secondary text-xs px-3 py-2 rounded-lg font-bold hover:bg-[#e2e1ed] transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLoginRedirect}
                  className="bg-gradient-to-br from-primary to-primary-container text-white px-5 py-2 rounded-lg font-manrope font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]" data-icon="login">login</span>
                  Entrar
                </button>
              )
            ) : (
              <div className="w-24 h-8 bg-surface-container-highest animate-pulse rounded-lg"></div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/10 bg-[#fbf8ff] shadow-sm pb-2">
          <nav className="flex flex-col py-2">
            <a className="flex items-center gap-4 px-6 py-3 text-[#1A237E] bg-[#1A237E]/5 font-manrope font-bold" href="/">
              <span className="material-symbols-outlined" data-icon="description">description</span>
              <span className="text-sm">Histórico Escolar</span>
            </a>
            <a className="flex items-center gap-4 px-6 py-3 text-[#585c80] hover:bg-[#e2e1ed] transition-colors font-manrope font-semibold" href={user ? "/profile" : "/login"}>
              <span className="material-symbols-outlined" data-icon="manage_accounts">manage_accounts</span>
              <span className="text-sm flex items-center gap-2">
                Meu Perfil
                {user && (!user.user_metadata?.emeb_name || !user.user_metadata?.emeb_cep) && (
                  <span className="bg-error text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-full animate-pulse tracking-wider">Pendente</span>
                )}
              </span>
            </a>
            <a className="flex items-center gap-4 px-6 py-3 text-[#585c80] hover:bg-[#e2e1ed] transition-colors font-manrope font-semibold" href={user ? "/templates" : "/login"}>
              <span className="material-symbols-outlined" data-icon="folder_special">folder_special</span>
              <span className="text-sm">Meus Templates</span>
            </a>
            
            <div className="h-px bg-outline-variant/20 mx-6 my-2"></div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText('48197@emeb.saobernardo.sp.gov.br');
                window.dispatchEvent(new CustomEvent('show_toast', { detail: 'E-mail copiado: 48197@emeb.saobernardo.sp.gov.br' }));
              }}
              className="flex w-full items-center gap-4 px-6 py-3 text-[#585c80] hover:bg-[#e2e1ed] transition-colors font-manrope font-semibold text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#1A237E]/10 flex items-center justify-center shrink-0 text-[#1A237E]">
                 <span className="material-symbols-outlined text-[16px]" data-icon="badge">badge</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#1A237E]">Daniel Marques de Sousa</span>
                <span className="text-[10px] text-secondary/70">Dev / Copiar E-mail (48197-6)</span>
              </div>
            </button>

            <div className="h-px bg-outline-variant/20 mx-6 my-2"></div>

            {user ? (
              <button onClick={handleLogout} className="flex w-full items-center gap-4 px-6 py-3 text-error hover:bg-error/10 transition-colors font-manrope font-bold">
                <span className="material-symbols-outlined" data-icon="logout">logout</span>
                <span className="text-sm">Sair da Conta</span>
              </button>
            ) : (
              <button onClick={handleLoginRedirect} className="flex w-full items-center gap-4 px-6 py-3 text-[#1A237E] hover:bg-[#1A237E]/10 transition-colors font-manrope font-bold">
                <span className="material-symbols-outlined" data-icon="login">login</span>
                <span className="text-sm">Entrar</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
